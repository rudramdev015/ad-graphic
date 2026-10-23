// ------------------------------------------------------------------
//  AD Graphic's 2.0 — API
//  Runs locally (server/index.js) and on Vercel (api/index.js).
// ------------------------------------------------------------------
import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mode as storageMode, mediaMode, readDoc, mutateDoc, DATA_DIR, UPLOAD_DIR } from './storage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
const ON_VERCEL = Boolean(process.env.VERCEL);

/* ------------------------------------------------------------------
   Config & admin auth
   ------------------------------------------------------------------ */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
const STATUSES = ['new', 'contacted', 'interview', 'enrolled', 'rejected'];
const MODES = ['pre-register', 'register', 'closed'];
const KIND_FOR_MODE = { 'pre-register': 'pre-registration', register: 'registration', closed: 'waitlist' };

// Token signing secret: env var, else a random one persisted locally so logins survive restarts.
async function loadSecret() {
  if (process.env.ADMIN_SECRET) return process.env.ADMIN_SECRET;
  const file = path.join(DATA_DIR, '.admin-secret');
  try {
    return (await fs.readFile(file, 'utf8')).trim();
  } catch {
    const s = crypto.randomBytes(32).toString('hex');
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(file, s, { mode: 0o600 });
    } catch {
      console.warn('⚠  Could not persist admin secret (read-only filesystem). Set ADMIN_SECRET.');
    }
    return s;
  }
}
const ADMIN_SECRET = await loadSecret();

if (!process.env.ADMIN_PASSWORD) {
  console.warn('⚠  ADMIN_PASSWORD not set — using default "admin123". Set it before going live.');
}

const sign = (payload) => crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64url');

function issueToken() {
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: Date.now() + TOKEN_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token = '') {
  const [payload, sig] = String(token).split('.');
  if (!payload || !sig) return false;
  const expected = sign(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!verifyToken(token)) return res.status(401).json({ ok: false, error: 'Session expired. Please log in again.' });
  next();
}

const safeEqual = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

/* ------------------------------------------------------------------
   App
   ------------------------------------------------------------------ */
const app = express();
app.set('trust proxy', true);
app.disable('x-powered-by');
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (req.path.startsWith('/api/')) res.setHeader('Cache-Control', 'no-store');
  next();
});
// Raw uploads must not be parsed as JSON.
app.use((req, res, next) => (req.path === '/api/admin/upload' ? next() : express.json({ limit: '300kb' })(req, res, next)));

/* ---------- rate limiting (per IP, per minute; per instance on Vercel) ---------- */
const hits = new Map();
function rateLimit(max = 5, bucket = 'default') {
  return (req, res, next) => {
    const key = `${bucket}:${req.ip}`;
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((t) => now - t < 60_000);
    if (recent.length >= max) {
      return res.status(429).json({ ok: false, error: 'Too many requests. Please try again in a minute.' });
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear();
    next();
  };
}

const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const newId = () => Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
const nowIso = () => new Date().toISOString();

/* ------------------------------------------------------------------
   Validation helpers
   ------------------------------------------------------------------ */
const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isPhone = (v) => /^[+\d][\d\s-]{7,16}$/.test(v);
const isSafeUrl = (v) => /^(https?:\/\/|\/(?!\/)|mailto:|tel:|#)/i.test(v);
const isMediaUrl = (v) => v === '' || /^https?:\/\/\S+$/i.test(v) || /^\/[\w\-./%]+$/.test(v);

function validateRegistration(body) {
  const data = {
    name: clean(body.name, 80),
    email: clean(body.email, 120).toLowerCase(),
    phone: clean(body.phone, 20),
    city: clean(body.city, 60),
    course: clean(body.course, 40),
    experience: clean(body.experience, 40),
    goal: clean(body.goal, 1000),
  };
  const errors = {};
  if (data.name.length < 2) errors.name = 'Please enter your full name.';
  if (!isEmail(data.email)) errors.email = 'Please enter a valid email.';
  if (!isPhone(data.phone)) errors.phone = 'Please enter a valid phone number.';
  if (!data.city) errors.city = 'Please enter your city.';
  if (!data.course) errors.course = 'Please choose a track.';
  if (!data.experience) errors.experience = 'Please choose your experience level.';
  return { data, errors };
}

/* ------------------------------------------------------------------
   Website content (Admin → Website content)
   ------------------------------------------------------------------ */
const CONTENT_KEYS = [
  'brand', 'admissions', 'hero', 'sections', 'stats', 'proof', 'studentStories', 'pillars', 'advantages',
  'curriculum', 'sessionFormat', 'skills', 'partners', 'comparison', 'fit', 'fees', 'faqs', 'showcase',
];
const URL_KEYS = /^(image|photo|poster|video|logo|instagram|whatsapp|mapsUrl|href|phoneHref)$/i;

function sanitizeContent(value, key = '', depth = 0) {
  if (depth > 6) throw new Error('Content is nested too deeply.');
  if (typeof value === 'string') {
    const s = value.slice(0, 3000);
    if (URL_KEYS.test(key) && s && !isSafeUrl(s)) throw new Error(`"${key}" must be a link starting with https://, /, mailto: or tel:`);
    return s;
  }
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'boolean' || value === null) return value;
  if (Array.isArray(value)) {
    if (value.length > 100) throw new Error('Lists can have at most 100 items.');
    return value.map((v) => sanitizeContent(v, key, depth + 1));
  }
  if (typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (/^(__proto__|constructor|prototype)$/.test(k)) continue;
      if (Object.keys(out).length >= 80) throw new Error('Too many fields.');
      const s = sanitizeContent(v, k, depth + 1);
      if (s !== undefined) out[k] = s;
    }
    return out;
  }
  return undefined;
}

const getContent = () => readDoc('content', {});

/* ------------------------------------------------------------------
   Public routes
   ------------------------------------------------------------------ */
app.get('/api/health', (_req, res) => res.json({ ok: true, storage: storageMode, media: mediaMode, time: nowIso() }));

app.get('/api/content', asyncRoute(async (_req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=10, stale-while-revalidate=60');
  res.json({ ok: true, content: await getContent() });
}));

const handleRegistration = asyncRoute(async (req, res) => {
  const { data, errors } = validateRegistration(req.body || {});
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  const content = await getContent();
  const mode = MODES.includes(content.admissions?.mode) ? content.admissions.mode : 'pre-register';
  const kind = KIND_FOR_MODE[mode];
  const batch = clean(content.brand?.batch || 'Batch 01', 40);

  const entry = await mutateDoc('applications', [], (entries) => {
    const dupe = entries.find((e) => e.type === 'registration' && e.email === data.email && (e.batch || batch) === batch);
    if (dupe) return { duplicate: true, id: dupe.id };
    const item = {
      id: newId(), type: 'registration', kind, batch, ...data,
      status: 'new', notes: '', createdAt: nowIso(), updatedAt: nowIso(),
    };
    entries.push(item);
    return item;
  });
  if (entry.duplicate) return res.status(200).json({ ok: true, id: entry.id, duplicate: true });
  console.log(`New ${kind}: ${data.name} <${data.email}>`);
  res.status(201).json({ ok: true, id: entry.id, kind });
});

app.post('/api/register', rateLimit(5, 'register'), handleRegistration);
app.post('/api/apply', rateLimit(5, 'register'), handleRegistration); // backwards-compatible alias

app.post('/api/contact', rateLimit(5, 'contact'), asyncRoute(async (req, res) => {
  const email = clean(req.body?.email, 120).toLowerCase();
  if (!isEmail(email)) return res.status(400).json({ ok: false, errors: { email: 'Please enter a valid email.' } });
  await mutateDoc('applications', [], (entries) => {
    entries.push({
      id: newId(), type: 'brochure', name: '', email, phone: '', city: '', course: '', experience: '', goal: '',
      status: 'new', notes: '', createdAt: nowIso(), updatedAt: nowIso(),
    });
  });
  res.status(201).json({ ok: true });
}));

/* ------------------------------------------------------------------
   Admin — auth & sign-ups
   ------------------------------------------------------------------ */
app.post('/api/admin/login', rateLimit(8, 'login'), (req, res) => {
  // trim stray spaces that phone keyboards / autocorrect add
  let given = String(req.body?.password ?? '').trim();
  let expected = ADMIN_PASSWORD.trim();
  // The built-in default password ignores capital letters (e.g. "Admin123").
  // A real ADMIN_PASSWORD set via environment variable stays exact and case-sensitive.
  if (!process.env.ADMIN_PASSWORD) { given = given.toLowerCase(); expected = expected.toLowerCase(); }
  if (!safeEqual(given, expected)) return res.status(401).json({ ok: false, error: 'Incorrect password.' });
  res.json({ ok: true, token: issueToken(), expiresIn: TOKEN_TTL_MS });
});

app.get('/api/admin/registrations', requireAdmin, asyncRoute(async (_req, res) => {
  const entries = (await readDoc('applications', []))
    .map((e) => ({ status: 'new', notes: '', type: 'registration', kind: 'pre-registration', ...e }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const today = nowIso().slice(0, 10);
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  const byKind = { 'pre-registration': 0, registration: 0, waitlist: 0 };
  const byDay = {};
  for (let i = 13; i >= 0; i--) byDay[new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)] = 0;

  for (const e of entries) {
    if (e.type === 'registration') {
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
      byKind[e.kind] = (byKind[e.kind] || 0) + 1;
    }
    const day = e.createdAt.slice(0, 10);
    if (day in byDay) byDay[day] += 1;
  }

  res.json({
    ok: true,
    entries,
    stats: {
      total: entries.filter((e) => e.type === 'registration').length,
      brochures: entries.filter((e) => e.type === 'brochure').length,
      today: entries.filter((e) => e.createdAt.startsWith(today)).length,
      byStatus,
      byKind,
      byDay: Object.entries(byDay).map(([date, count]) => ({ date, count })),
    },
    statuses: STATUSES,
  });
}));

app.patch('/api/admin/registrations/:id', requireAdmin, asyncRoute(async (req, res) => {
  const { status, notes, kind } = req.body || {};
  if (status !== undefined && !STATUSES.includes(status)) return res.status(400).json({ ok: false, error: 'Invalid status.' });
  if (kind !== undefined && !Object.values(KIND_FOR_MODE).includes(kind)) return res.status(400).json({ ok: false, error: 'Invalid type.' });
  const updated = await mutateDoc('applications', [], (entries) => {
    const e = entries.find((x) => x.id === req.params.id);
    if (!e) return null;
    if (status !== undefined) e.status = status;
    if (kind !== undefined) e.kind = kind;
    if (notes !== undefined) e.notes = clean(notes, 2000);
    e.updatedAt = nowIso();
    return e;
  });
  if (!updated) return res.status(404).json({ ok: false, error: 'Not found.' });
  res.json({ ok: true, entry: updated });
}));

// Bulk actions: { ids: [...], status?, kind?, delete? }
app.post('/api/admin/registrations/bulk', requireAdmin, asyncRoute(async (req, res) => {
  const ids = new Set(Array.isArray(req.body?.ids) ? req.body.ids.slice(0, 1000) : []);
  const { status, kind } = req.body || {};
  const remove = req.body?.delete === true;
  if (!ids.size) return res.status(400).json({ ok: false, error: 'Select at least one entry.' });
  if (status !== undefined && !STATUSES.includes(status)) return res.status(400).json({ ok: false, error: 'Invalid status.' });
  if (kind !== undefined && !Object.values(KIND_FOR_MODE).includes(kind)) return res.status(400).json({ ok: false, error: 'Invalid type.' });
  const changed = await mutateDoc('applications', [], (entries) => {
    let n = 0;
    if (remove) {
      for (let i = entries.length - 1; i >= 0; i--) if (ids.has(entries[i].id)) { entries.splice(i, 1); n++; }
      return n;
    }
    for (const e of entries) {
      if (!ids.has(e.id)) continue;
      if (status !== undefined) e.status = status;
      if (kind !== undefined) e.kind = kind;
      e.updatedAt = nowIso();
      n++;
    }
    return n;
  });
  res.json({ ok: true, changed });
}));

app.delete('/api/admin/registrations/:id', requireAdmin, asyncRoute(async (req, res) => {
  const removed = await mutateDoc('applications', [], (entries) => {
    const i = entries.findIndex((x) => x.id === req.params.id);
    return i === -1 ? false : entries.splice(i, 1).length > 0;
  });
  if (!removed) return res.status(404).json({ ok: false, error: 'Not found.' });
  res.json({ ok: true });
}));

app.get('/api/admin/export.csv', requireAdmin, asyncRoute(async (_req, res) => {
  const cols = ['createdAt', 'type', 'kind', 'batch', 'status', 'name', 'email', 'phone', 'city', 'course', 'experience', 'goal', 'notes'];
  const esc = (v) => {
    let s = String(v ?? '');
    if (/^[=+\-@]/.test(s)) s = `'${s}`; // prevent spreadsheet formula injection
    return `"${s.replace(/"/g, '""')}"`;
  };
  const rows = (await readDoc('applications', [])).map((e) => cols.map((c) => esc(e[c])).join(','));
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="signups-${nowIso().slice(0, 10)}.csv"`);
  res.send('﻿' + [cols.join(','), ...rows].join('\n'));
}));

/* ------------------------------------------------------------------
   Admin — website content
   ------------------------------------------------------------------ */
app.get('/api/admin/content', requireAdmin, asyncRoute(async (_req, res) => {
  res.json({ ok: true, content: await getContent(), keys: CONTENT_KEYS, storage: storageMode });
}));

app.put('/api/admin/content/:key', requireAdmin, asyncRoute(async (req, res) => {
  const { key } = req.params;
  if (!CONTENT_KEYS.includes(key)) return res.status(404).json({ ok: false, error: 'Unknown section.' });
  let value;
  try {
    value = sanitizeContent(req.body?.value, key);
  } catch (err) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  if (value === undefined || value === null) return res.status(400).json({ ok: false, error: 'Nothing to save.' });
  if (key === 'admissions' && value.mode !== undefined && !MODES.includes(value.mode)) {
    return res.status(400).json({ ok: false, error: 'Admission mode must be pre-register, register or closed.' });
  }
  const content = await mutateDoc('content', {}, (doc) => {
    doc[key] = value;
    doc._updatedAt = nowIso();
    return doc;
  });
  res.json({ ok: true, content });
}));

app.delete('/api/admin/content/:key', requireAdmin, asyncRoute(async (req, res) => {
  const { key } = req.params;
  if (!CONTENT_KEYS.includes(key)) return res.status(404).json({ ok: false, error: 'Unknown section.' });
  const content = await mutateDoc('content', {}, (doc) => {
    delete doc[key];
    doc._updatedAt = nowIso();
    return doc;
  });
  res.json({ ok: true, content });
}));

/* ------------------------------------------------------------------
   Video testimonials — public read, admin CRUD
   ------------------------------------------------------------------ */
const SEED_REELS = ['DafsRKlvTXn', 'Derp3ZKPHZt', 'DeR1byKuVIN', 'DeCdLLLPMsz', 'DdYkAs_ES8S', 'Dcu3XJOO_sC', 'DbZikfZD1wx', 'DZaGMMHPljE'];
const SEED_TESTIMONIALS = SEED_REELS.map((code, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    id: `reel${i}`, name: `Student Story ${n}`, role: 'Student Reel', quote: '', poster: `/students/st${n}.webp`,
    video: `https://www.instagram.com/reel/${code}/`, published: true, order: i,
    createdAt: '2026-10-22T00:00:00.000Z', updatedAt: '2026-10-22T00:00:00.000Z',
  };
});

const readTestimonials = () => readDoc('testimonials', SEED_TESTIMONIALS);
const mutateTestimonials = (fn) => mutateDoc('testimonials', SEED_TESTIMONIALS, async (list) => {
  const result = await fn(list);
  list.sort((a, b) => a.order - b.order).forEach((t, i) => { t.order = i; });
  return result;
});

function validateTestimonial(body) {
  const data = {
    name: clean(body.name, 60),
    role: clean(body.role, 60),
    quote: clean(body.quote, 400),
    poster: clean(body.poster, 600),
    video: clean(body.video, 600),
    published: body.published !== false,
  };
  const errors = {};
  if (data.name.length < 2) errors.name = 'Name is required.';
  if (!data.role) errors.role = 'Role is required.';
  if (!data.video || !isMediaUrl(data.video)) errors.video = 'Add a video link (MP4, YouTube or Instagram reel) or upload a file.';
  if (!isMediaUrl(data.poster)) errors.poster = 'Poster must be a valid URL or uploaded image.';
  return { data, errors };
}

app.get('/api/testimonials', asyncRoute(async (_req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=10, stale-while-revalidate=60');
  const list = (await readTestimonials()).filter((t) => t.published).sort((a, b) => a.order - b.order);
  res.json({ ok: true, testimonials: list.map(({ id, name, role, quote, poster, video }) => ({ id, name, role, quote, poster, video })) });
}));

app.get('/api/admin/testimonials', requireAdmin, asyncRoute(async (_req, res) => {
  res.json({ ok: true, testimonials: (await readTestimonials()).sort((a, b) => a.order - b.order) });
}));

app.post('/api/admin/testimonials', requireAdmin, asyncRoute(async (req, res) => {
  const { data, errors } = validateTestimonial(req.body || {});
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  const item = await mutateTestimonials((list) => {
    const t = { id: newId(), ...data, order: list.length, createdAt: nowIso(), updatedAt: nowIso() };
    list.push(t);
    return t;
  });
  res.status(201).json({ ok: true, testimonial: item });
}));

app.put('/api/admin/testimonials/:id', requireAdmin, asyncRoute(async (req, res) => {
  const { data, errors } = validateTestimonial(req.body || {});
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  const item = await mutateTestimonials((list) => {
    const t = list.find((x) => x.id === req.params.id);
    if (!t) return null;
    Object.assign(t, data, { updatedAt: nowIso() });
    return t;
  });
  if (!item) return res.status(404).json({ ok: false, error: 'Not found.' });
  res.json({ ok: true, testimonial: item });
}));

app.delete('/api/admin/testimonials/:id', requireAdmin, asyncRoute(async (req, res) => {
  const removed = await mutateTestimonials((list) => {
    const i = list.findIndex((x) => x.id === req.params.id);
    return i === -1 ? false : list.splice(i, 1).length > 0;
  });
  if (!removed) return res.status(404).json({ ok: false, error: 'Not found.' });
  res.json({ ok: true });
}));

app.post('/api/admin/testimonials/reorder', requireAdmin, asyncRoute(async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const list = await mutateTestimonials((items) => {
    ids.forEach((id, i) => { const t = items.find((x) => x.id === id); if (t) t.order = i; });
    return items;
  });
  res.json({ ok: true, testimonials: list });
}));

/* ------------------------------------------------------------------
   Media uploads
   - Local: raw streaming upload to server/uploads
   - Vercel: browser uploads straight to Vercel Blob (no 4.5 MB limit);
     this route only issues a short-lived upload token to admins.
   ------------------------------------------------------------------ */
const UPLOAD_LIMIT = 200 * 1024 * 1024; // 200 MB
const UPLOAD_TYPES = { '.jpg': 'image', '.jpeg': 'image', '.png': 'image', '.webp': 'image', '.svg': 'image', '.mp4': 'video', '.webm': 'video', '.mov': 'video' };
const BLOB_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime'];

app.get('/api/admin/upload-config', requireAdmin, (_req, res) => {
  res.json({ ok: true, mode: mediaMode, maxBytes: UPLOAD_LIMIT });
});

app.post('/api/admin/blob-upload', asyncRoute(async (req, res) => {
  if (mediaMode !== 'blob') return res.status(400).json({ ok: false, error: 'Cloud uploads are not enabled.' });
  const { handleUpload } = await import('@vercel/blob/client');
  try {
    const json = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!verifyToken(clientPayload || '')) throw new Error('Session expired. Please log in again.');
        if (!/^media\//.test(pathname)) throw new Error('Invalid upload path.');
        return { allowedContentTypes: BLOB_TYPES, maximumSizeInBytes: UPLOAD_LIMIT, addRandomSuffix: true };
      },
    });
    res.json(json);
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
}));

app.post('/api/admin/upload', requireAdmin, asyncRoute(async (req, res) => {
  if (ON_VERCEL) return res.status(400).json({ ok: false, error: 'Use cloud upload on Vercel.' });
  const original = decodeURIComponent(String(req.headers['x-filename'] || ''));
  const ext = path.extname(original).toLowerCase();
  if (!UPLOAD_TYPES[ext]) return res.status(400).json({ ok: false, error: 'Only JPG, PNG, WEBP, SVG, MP4, WEBM or MOV files are allowed.' });
  if (Number(req.headers['content-length'] || 0) > UPLOAD_LIMIT) return res.status(413).json({ ok: false, error: 'File is larger than 200 MB.' });

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now().toString(36)}-${crypto.randomBytes(5).toString('hex')}${ext}`;
  const dest = path.join(UPLOAD_DIR, name);
  const out = createWriteStream(dest);
  let bytes = 0;
  let failed = false;

  const fail = async (status, error) => {
    if (failed) return;
    failed = true;
    out.destroy();
    await fs.rm(dest, { force: true });
    if (!res.headersSent) res.status(status).json({ ok: false, error });
  };

  req.on('data', (chunk) => {
    bytes += chunk.length;
    if (bytes > UPLOAD_LIMIT) { req.unpipe(out); req.resume(); fail(413, 'File is larger than 200 MB.'); }
  });
  req.on('aborted', () => fail(400, 'Upload cancelled.'));
  out.on('error', () => fail(500, 'Could not save file.'));
  out.on('finish', async () => {
    if (failed) return;
    if (bytes === 0) return fail(400, 'The file was empty.');
    res.status(201).json({ ok: true, url: `/uploads/${name}`, kind: UPLOAD_TYPES[ext], bytes });
  });
  req.pipe(out);
}));

app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }));

/* ------------------------------------------------------------------
   Errors + static site (local production only)
   ------------------------------------------------------------------ */
app.use('/api', (_req, res) => res.status(404).json({ ok: false, error: 'Not found.' }));

if (!ON_VERCEL) {
  app.use(express.static(CLIENT_DIST));
  app.get(/^(?!\/api).*/, (_req, res, next) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'), (err) => err && next());
  });
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  if (!res.headersSent) res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' });
});

export default app;
