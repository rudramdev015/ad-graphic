import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'applications.json');
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');

// Admin credentials — set ADMIN_PASSWORD (and ADMIN_SECRET) in production.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
// Token signing secret: env var, else a random one persisted to disk so logins survive restarts.
const SECRET_FILE = path.join(__dirname, 'data', '.admin-secret');
const ADMIN_SECRET = process.env.ADMIN_SECRET || (await (async () => {
  try {
    return (await fs.readFile(SECRET_FILE, 'utf8')).trim();
  } catch {
    const s = crypto.randomBytes(32).toString('hex');
    await fs.mkdir(path.dirname(SECRET_FILE), { recursive: true });
    await fs.writeFile(SECRET_FILE, s, { mode: 0o600 });
    return s;
  }
})());
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
const STATUSES = ['new', 'contacted', 'interview', 'enrolled', 'rejected'];

if (!process.env.ADMIN_PASSWORD) {
  console.warn('⚠  ADMIN_PASSWORD not set — using default "admin123". Set it before going live.');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '20kb' }));

// ------------------------------------------------------------------
//  Rate limiting (per IP, per minute)
// ------------------------------------------------------------------
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
    next();
  };
}

// ------------------------------------------------------------------
//  Storage — JSON file with a serialized write queue
// ------------------------------------------------------------------
let queue = Promise.resolve();

async function readEntries() {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function mutate(fn) {
  const run = queue.then(async () => {
    const entries = await readEntries();
    const result = await fn(entries);
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const tmp = `${DATA_FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(entries, null, 2));
    await fs.rename(tmp, DATA_FILE);
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

const newId = () => Date.now().toString(36) + crypto.randomBytes(3).toString('hex');

// ------------------------------------------------------------------
//  Validation
// ------------------------------------------------------------------
const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isPhone = (v) => /^[+\d][\d\s-]{7,16}$/.test(v);

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

// ------------------------------------------------------------------
//  Admin auth — HMAC-signed bearer tokens
// ------------------------------------------------------------------
const sign = (payload) => crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64url');

function issueToken() {
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: Date.now() + TOKEN_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token = '') {
  const [payload, sig] = token.split('.');
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

// ------------------------------------------------------------------
//  Public routes
// ------------------------------------------------------------------
app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

async function handleRegistration(req, res) {
  const { data, errors } = validateRegistration(req.body || {});
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  try {
    const entry = await mutate((entries) => {
      const dupe = entries.find((e) => e.type === 'registration' && e.email === data.email);
      if (dupe) return { duplicate: true, id: dupe.id };
      const item = {
        id: newId(), type: 'registration', ...data,
        status: 'new', notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      entries.push(item);
      return item;
    });
    if (entry.duplicate) {
      return res.status(200).json({ ok: true, id: entry.id, duplicate: true });
    }
    console.log(`New pre-registration: ${data.name} <${data.email}>`);
    res.status(201).json({ ok: true, id: entry.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Could not save your registration. Please try again.' });
  }
}

app.post('/api/register', rateLimit(5, 'register'), handleRegistration);
app.post('/api/apply', rateLimit(5, 'register'), handleRegistration); // backwards-compatible alias

app.post('/api/contact', rateLimit(5, 'contact'), async (req, res) => {
  const email = clean(req.body?.email, 120).toLowerCase();
  if (!isEmail(email)) return res.status(400).json({ ok: false, errors: { email: 'Please enter a valid email.' } });
  await mutate((entries) => {
    entries.push({
      id: newId(), type: 'brochure', name: '', email, phone: '', city: '', course: '', experience: '', goal: '',
      status: 'new', notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  });
  res.status(201).json({ ok: true });
});

// ------------------------------------------------------------------
//  Admin routes
// ------------------------------------------------------------------
app.post('/api/admin/login', rateLimit(8, 'login'), (req, res) => {
  // trim stray spaces that phone keyboards / autocorrect add
  let given = String(req.body?.password ?? '').trim();
  let expected = ADMIN_PASSWORD.trim();
  // The built-in default password ignores capital letters (e.g. "Admin123").
  // A real ADMIN_PASSWORD set via environment variable stays exact and case-sensitive.
  if (!process.env.ADMIN_PASSWORD) { given = given.toLowerCase(); expected = expected.toLowerCase(); }
  if (!safeEqual(given, expected)) {
    return res.status(401).json({ ok: false, error: 'Incorrect password.' });
  }
  res.json({ ok: true, token: issueToken(), expiresIn: TOKEN_TTL_MS });
});

app.get('/api/admin/registrations', requireAdmin, async (_req, res) => {
  const entries = (await readEntries())
    .map((e) => ({ status: 'new', notes: '', type: 'registration', ...e }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const today = new Date().toISOString().slice(0, 10);
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  const byDay = {};
  for (let i = 13; i >= 0; i--) byDay[new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)] = 0;

  for (const e of entries) {
    if (e.type === 'registration') byStatus[e.status] = (byStatus[e.status] || 0) + 1;
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
      byDay: Object.entries(byDay).map(([date, count]) => ({ date, count })),
    },
    statuses: STATUSES,
  });
});

app.patch('/api/admin/registrations/:id', requireAdmin, async (req, res) => {
  const { status, notes } = req.body || {};
  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ ok: false, error: 'Invalid status.' });
  }
  const updated = await mutate((entries) => {
    const e = entries.find((x) => x.id === req.params.id);
    if (!e) return null;
    if (status !== undefined) e.status = status;
    if (notes !== undefined) e.notes = clean(notes, 2000);
    e.updatedAt = new Date().toISOString();
    return e;
  });
  if (!updated) return res.status(404).json({ ok: false, error: 'Not found.' });
  res.json({ ok: true, entry: updated });
});

app.delete('/api/admin/registrations/:id', requireAdmin, async (req, res) => {
  const removed = await mutate((entries) => {
    const i = entries.findIndex((x) => x.id === req.params.id);
    return i === -1 ? false : entries.splice(i, 1).length > 0;
  });
  if (!removed) return res.status(404).json({ ok: false, error: 'Not found.' });
  res.json({ ok: true });
});

app.get('/api/admin/export.csv', requireAdmin, async (_req, res) => {
  const cols = ['createdAt', 'type', 'status', 'name', 'email', 'phone', 'city', 'course', 'experience', 'goal', 'notes'];
  const esc = (v) => {
    let s = String(v ?? '');
    if (/^[=+\-@]/.test(s)) s = `'${s}`; // prevent spreadsheet formula injection
    return `"${s.replace(/"/g, '""')}"`;
  };
  const rows = (await readEntries()).map((e) => cols.map((c) => esc(e[c])).join(','));
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="registrations-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send('﻿' + [cols.join(','), ...rows].join('\n'));
});

// ------------------------------------------------------------------
//  Video testimonials — public read, admin CRUD + uploads
// ------------------------------------------------------------------
const TESTI_FILE = path.join(__dirname, 'data', 'testimonials.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const UPLOAD_LIMIT = 200 * 1024 * 1024; // 200 MB
const UPLOAD_TYPES = { '.jpg': 'image', '.jpeg': 'image', '.png': 'image', '.webp': 'image', '.mp4': 'video', '.webm': 'video', '.mov': 'video' };

const SEED_TESTIMONIALS = [
  ['Aarav Mehta', 'Freelance Video Editor', 'I went from random phone edits to delivering brand films for paying clients in five months.', '/students/s1.jpg'],
  ['Simran Kaur', 'Graphic Designer', 'Learning design and editing together made me twice as valuable to every client I pitch.', '/students/s2.jpg'],
  ['Rohan Verma', 'Motion Designer', 'The mentors reviewed my timeline line by line. That feedback changed how I animate.', '/students/s3.jpg'],
  ['Ishita Sharma', 'Social Media Designer', 'Every week was a real brief. My portfolio was full of live work before graduation.', '/students/s4.jpg'],
  ['Kabir Singh', 'Content Lead', 'They treat you like a junior on the team, not a student in a classroom.', '/students/s5.jpg'],
  ['Neha Gupta', 'Brand Designer', 'Typography, colour, motion — it finally clicked because we practised on real projects.', '/students/s6.jpg'],
  ['Dev Malhotra', 'YouTube Editor', 'My retention editing got so much sharper. Creators now come to me for long-form edits.', ''],
  ['Priya Nair', 'Junior Art Director', 'The client-communication sessions helped me land my first retainer during the course.', ''],
].map(([name, role, quote, poster], i) => ({
  id: `seed${i}`, name, role, quote, poster, video: '/studio.mp4', published: true, order: i,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
}));

let testiQueue = Promise.resolve();
async function readTestimonials() {
  try {
    return JSON.parse(await fs.readFile(TESTI_FILE, 'utf8'));
  } catch {
    return structuredClone(SEED_TESTIMONIALS);
  }
}
function mutateTestimonials(fn) {
  const run = testiQueue.then(async () => {
    const list = await readTestimonials();
    const result = await fn(list);
    list.sort((a, b) => a.order - b.order).forEach((t, i) => { t.order = i; });
    await fs.mkdir(path.dirname(TESTI_FILE), { recursive: true });
    await fs.writeFile(`${TESTI_FILE}.tmp`, JSON.stringify(list, null, 2));
    await fs.rename(`${TESTI_FILE}.tmp`, TESTI_FILE);
    return result;
  });
  testiQueue = run.catch(() => {});
  return run;
}

const isMediaUrl = (v) => v === '' || /^https?:\/\/\S+$/i.test(v) || /^\/[\w\-./]+$/.test(v);

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
  if (!data.quote) errors.quote = 'Quote is required.';
  if (!data.video || !isMediaUrl(data.video)) errors.video = 'Add a video link (MP4 or YouTube) or upload a file.';
  if (!isMediaUrl(data.poster)) errors.poster = 'Poster must be a valid URL or uploaded image.';
  return { data, errors };
}

app.get('/api/testimonials', async (_req, res) => {
  const list = (await readTestimonials()).filter((t) => t.published).sort((a, b) => a.order - b.order);
  res.json({ ok: true, testimonials: list.map(({ id, name, role, quote, poster, video }) => ({ id, name, role, quote, poster, video })) });
});

app.get('/api/admin/testimonials', requireAdmin, async (_req, res) => {
  res.json({ ok: true, testimonials: (await readTestimonials()).sort((a, b) => a.order - b.order) });
});

app.post('/api/admin/testimonials', requireAdmin, async (req, res) => {
  const { data, errors } = validateTestimonial(req.body || {});
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  const item = await mutateTestimonials((list) => {
    const t = { id: newId(), ...data, order: list.length, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    list.push(t);
    return t;
  });
  res.status(201).json({ ok: true, testimonial: item });
});

app.put('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
  const { data, errors } = validateTestimonial(req.body || {});
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  const item = await mutateTestimonials((list) => {
    const t = list.find((x) => x.id === req.params.id);
    if (!t) return null;
    Object.assign(t, data, { updatedAt: new Date().toISOString() });
    return t;
  });
  if (!item) return res.status(404).json({ ok: false, error: 'Not found.' });
  res.json({ ok: true, testimonial: item });
});

app.delete('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
  const removed = await mutateTestimonials((list) => {
    const i = list.findIndex((x) => x.id === req.params.id);
    return i === -1 ? false : list.splice(i, 1).length > 0;
  });
  if (!removed) return res.status(404).json({ ok: false, error: 'Not found.' });
  res.json({ ok: true });
});

app.post('/api/admin/testimonials/reorder', requireAdmin, async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const list = await mutateTestimonials((items) => {
    ids.forEach((id, i) => { const t = items.find((x) => x.id === id); if (t) t.order = i; });
    return items;
  });
  res.json({ ok: true, testimonials: list });
});

// Raw streaming upload: body = file bytes, X-Filename header = original name.
app.post('/api/admin/upload', requireAdmin, async (req, res) => {
  const original = decodeURIComponent(String(req.headers['x-filename'] || ''));
  const ext = path.extname(original).toLowerCase();
  if (!UPLOAD_TYPES[ext]) return res.status(400).json({ ok: false, error: 'Only JPG, PNG, WEBP, MP4, WEBM or MOV files are allowed.' });
  const declared = Number(req.headers['content-length'] || 0);
  if (declared > UPLOAD_LIMIT) return res.status(413).json({ ok: false, error: 'File is larger than 200 MB.' });

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now().toString(36)}-${crypto.randomBytes(5).toString('hex')}${ext}`;
  const dest = path.join(UPLOAD_DIR, name);
  const { createWriteStream } = await import('node:fs');
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
  out.on('finish', () => {
    if (failed) return;
    res.status(201).json({ ok: true, url: `/uploads/${name}`, kind: UPLOAD_TYPES[ext], bytes });
  });
  req.pipe(out);
});

app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }));

// ------------------------------------------------------------------
//  Serve the React build in production (site + /admin)
// ------------------------------------------------------------------
app.use(express.static(CLIENT_DIST));
app.get(/^(?!\/api).*/, (_req, res, next) => {
  res.sendFile(path.join(CLIENT_DIST, 'index.html'), (err) => err && next());
});

app.listen(PORT, () => {
  console.log(`AD Graphic's server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin (after npm run build) or http://localhost:5173/admin in dev`);
});
