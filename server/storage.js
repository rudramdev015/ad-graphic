// ------------------------------------------------------------------
//  Storage adapter
//  - Local (default): JSON files in server/data, uploads in server/uploads
//  - Vercel: JSON docs (sign-ups, content) in a PRIVATE Blob store
//    (DATA_READ_WRITE_TOKEN); photos/videos in the public store
//    (BLOB_READ_WRITE_TOKEN). Enabled automatically when a token is set.
//  - MongoDB: when MONGODB_URI is set, JSON docs live in MongoDB instead
//    (works on Vercel, Render or any host). Media still uses Blob/local.
// ------------------------------------------------------------------
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(__dirname, 'data');
export const UPLOAD_DIR = path.join(__dirname, 'uploads');
const MONGODB_URI = process.env.MONGODB_URI;
const DATA_TOKEN = process.env.DATA_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
/** Where JSON docs (content, testimonials, sign-ups) are stored. */
export const mode = MONGODB_URI ? 'mongo' : DATA_TOKEN ? 'blob' : 'local';
/** Where uploaded photos/videos go. */
export const mediaMode = process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'local';

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
  const res = await get(docPath(name), { access: 'private', useCache: false, token: DATA_TOKEN });
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
    // first write must not clobber a doc another request just created
    allowOverwrite: Boolean(etag),
    cacheControlMaxAge: 60,
    token: DATA_TOKEN,
    ...(etag ? { ifMatch: etag } : {}),
  });
}

/* ------------------------------ mongo ------------------------------ */
// One collection, one document per name: { _id: name, data, v }. `v` is a
// version counter used for optimistic concurrency, like the Blob ETag.
let docsPromise;
function docs() {
  docsPromise ??= (async () => {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(MONGODB_URI, { maxPoolSize: 5, serverSelectionTimeoutMS: 8000 });
    await client.connect();
    return client.db(process.env.MONGODB_DB || 'adgraphic').collection('docs');
  })().catch((err) => { docsPromise = undefined; throw err; });
  return docsPromise;
}

async function mongoRead(name) {
  const doc = await (await docs()).findOne({ _id: name });
  return doc ? { data: doc.data, v: doc.v } : { data: undefined, v: 0 };
}

async function mongoMutate(name, fallback, fn) {
  const col = await docs();
  for (let attempt = 0; attempt < 6; attempt++) {
    const { data, v } = await mongoRead(name);
    const draft = data ?? clone(fallback);
    const result = await fn(draft);
    try {
      if (v === 0) {
        await col.insertOne({ _id: name, data: draft, v: 1, updatedAt: new Date() });
        return result;
      }
      const { matchedCount } = await col.updateOne({ _id: name, v }, { $set: { data: draft, v: v + 1, updatedAt: new Date() } });
      if (matchedCount === 1) return result;
    } catch (err) {
      if (err?.code !== 11000) throw err; // duplicate key = someone created it first
    }
    await new Promise((r) => setTimeout(r, 60 * (attempt + 1) + Math.random() * 80));
  }
  throw new Error(`Could not save "${name}" — too many simultaneous edits. Please try again.`);
}

/* ------------------------------ public API ------------------------- */

/** Read a JSON document, returning `fallback` when it doesn't exist yet. */
export async function readDoc(name, fallback) {
  const data = mode === 'mongo' ? (await mongoRead(name)).data
    : mode === 'blob' ? (await blobRead(name)).data
    : await localRead(name);
  return data === undefined ? clone(fallback) : data;
}

/**
 * Read-modify-write a JSON document safely.
 * `fn(draft)` mutates the draft and returns a result.
 * Local: serialized per document. Blob/Mongo: optimistic concurrency with retries.
 */
export function mutateDoc(name, fallback, fn) {
  if (mode === 'mongo') return mongoMutate(name, fallback, fn);
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
      const conflict = err instanceof BlobPreconditionFailedError || /precondition|already exists|conflict/i.test(err?.message || '');
      if (!conflict) throw err;
      await new Promise((r) => setTimeout(r, 60 * (attempt + 1) + Math.random() * 80));
    }
  }
  throw new Error(`Could not save "${name}" — too many simultaneous edits. Please try again.`);
}
