// ------------------------------------------------------------------
//  Storage adapter
//  - Local (default): JSON files in server/data, uploads in server/uploads
//  - Vercel: private Vercel Blob for JSON docs, public Blob for media
//    (enabled automatically when BLOB_READ_WRITE_TOKEN is set)
// ------------------------------------------------------------------
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(__dirname, 'data');
export const UPLOAD_DIR = path.join(__dirname, 'uploads');
export const mode = process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'local';

const clone = (v) => (v === undefined ? v : structuredClone(v));
let blobSdk;
const sdk = async () => (blobSdk ??= await import('@vercel/blob'));

/* ------------------------------ local ------------------------------ */
const queues = new Map(); // one write queue per document

async function localRead(name) {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, `${name}.json`), 'utf8'));
  } catch {
    return undefined;
  }
}

async function localWrite(name, data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, `${name}.json`);
  await fs.writeFile(`${file}.tmp`, JSON.stringify(data, null, 2));
  await fs.rename(`${file}.tmp`, file);
}

/* ------------------------------ blob ------------------------------- */
const docPath = (name) => `data/${name}.json`;

async function blobRead(name) {
  const { get } = await sdk();
  const res = await get(docPath(name), { access: 'private', useCache: false });
  if (!res || res.statusCode !== 200) return { data: undefined, etag: null };
  const text = await new Response(res.stream).text();
  return { data: JSON.parse(text), etag: res.blob.etag };
}

async function blobWrite(name, data, etag) {
  const { put } = await sdk();
  await put(docPath(name), JSON.stringify(data), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    ...(etag ? { ifMatch: etag } : {}),
  });
}

/* ------------------------------ public API ------------------------- */

/** Read a JSON document, returning `fallback` when it doesn't exist yet. */
export async function readDoc(name, fallback) {
  const data = mode === 'blob' ? (await blobRead(name)).data : await localRead(name);
  return data === undefined ? clone(fallback) : data;
}

/**
 * Read-modify-write a JSON document safely.
 * `fn(draft)` mutates the draft and returns a result.
 * Local: serialized per document. Blob: optimistic concurrency with ETag retries.
 */
export function mutateDoc(name, fallback, fn) {
  if (mode === 'blob') return blobMutate(name, fallback, fn);
  const prev = queues.get(name) || Promise.resolve();
  const run = prev.then(async () => {
    const draft = (await localRead(name)) ?? clone(fallback);
    const result = await fn(draft);
    await localWrite(name, draft);
    return result;
  });
  queues.set(name, run.catch(() => {}));
  return run;
}

async function blobMutate(name, fallback, fn) {
  const { BlobPreconditionFailedError } = await sdk();
  for (let attempt = 0; attempt < 6; attempt++) {
    const { data, etag } = await blobRead(name);
    const draft = data ?? clone(fallback);
    const result = await fn(draft);
    try {
      await blobWrite(name, draft, etag);
      return result;
    } catch (err) {
      const conflict = err instanceof BlobPreconditionFailedError || /precondition/i.test(err?.message || '');
      if (!conflict) throw err;
      await new Promise((r) => setTimeout(r, 60 * (attempt + 1) + Math.random() * 80));
    }
  }
  throw new Error(`Could not save "${name}" — too many simultaneous edits. Please try again.`);
}
