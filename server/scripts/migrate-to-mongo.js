// One-time copy of the JSON docs (content, testimonials, sign-ups) into MongoDB.
//
//   MONGODB_URI=... [DATA_READ_WRITE_TOKEN=...] node server/scripts/migrate-to-mongo.js [--force]
//
// Reads from the private Blob store when DATA_READ_WRITE_TOKEN is set, otherwise
// from server/data/*.json. Docs already in MongoDB are skipped unless --force.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';

const NAMES = ['content', 'testimonials', 'applications'];
const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const { MONGODB_URI, MONGODB_DB = 'adgraphic' } = process.env;
const TOKEN = process.env.DATA_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
const force = process.argv.includes('--force');

if (!MONGODB_URI) {
  console.error('Set MONGODB_URI first.');
  process.exit(1);
}

async function readSource(name) {
  if (TOKEN) {
    const { get } = await import('@vercel/blob');
    const res = await get(`data/${name}.json`, { access: 'private', useCache: false, token: TOKEN }).catch(() => null);
    return res?.statusCode === 200 ? JSON.parse(await new Response(res.stream).text()) : undefined;
  }
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, `${name}.json`), 'utf8'));
  } catch {
    return undefined;
  }
}

const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
try {
  await client.connect();
  const col = client.db(MONGODB_DB).collection('docs');
  console.log(`Source: ${TOKEN ? 'Vercel Blob (private store)' : 'server/data'}  →  MongoDB "${MONGODB_DB}"`);
  for (const name of NAMES) {
    const data = await readSource(name);
    if (data === undefined) { console.log(`  ${name}: nothing to copy`); continue; }
    const exists = await col.findOne({ _id: name }, { projection: { _id: 1 } });
    if (exists && !force) { console.log(`  ${name}: already in MongoDB, skipped (use --force to overwrite)`); continue; }
    await col.replaceOne({ _id: name }, { data, v: 1, updatedAt: new Date() }, { upsert: true });
    const count = Array.isArray(data) ? `${data.length} items` : 'object';
    console.log(`  ${name}: copied (${count})`);
  }
} finally {
  await client.close();
}
