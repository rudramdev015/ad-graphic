# AD Graphic's 2.0 — Website

Creative Graphics Designing | Video Editing academy website.
**Frontend:** React 18 + Vite · **Backend:** Node.js + Express

## Quick start

```bash
npm run install:all   # installs root, client and server packages
npm run dev           # React on http://localhost:5173, API on http://localhost:5000
```

## Production

```bash
npm run build         # builds the React app into client/dist
npm start             # Express serves the site + API on http://localhost:5000
```

## Customising

| What | Where |
| --- | --- |
| Name, phone, email, address, fees, curriculum, FAQs, testimonials | `client/src/data/site.js` |
| Your real logo image | Save it as `client/public/logo.png` (used automatically) |
| Colours & fonts | Top of `client/src/styles.css` (`--yellow`, `--crimson`, `--ink`) |

Values marked `placeholder` in `site.js` (stats, testimonials, partner names, fees, contact details) are sample content — replace them with your real data before going live.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/register` | Pre-registration form (`name, email, phone, city, course, experience, goal`) |
| POST | `/api/contact` | Brochure request (`email`) |

Submissions are saved to `server/data/applications.json`.

## Admin panel

Open **http://localhost:5173/admin** (dev) or **/admin** on the live site.

- Default password: `admin123`. **Change it before going live:**
  - PowerShell: `$env:ADMIN_PASSWORD="your-strong-password"; npm start`
  - Also set `ADMIN_SECRET` to a long random string so logins survive server restarts.
- Features: live stats, 14-day chart, pipeline (New → Contacted → Interview → Enrolled / Rejected),
  search & filters, per-student notes, one-click Call / WhatsApp / Email, delete, CSV export (opens in Excel).

### Admin API (Bearer token from `/api/admin/login`)

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/admin/login` | `{ password }` → `{ token }` |
| GET | `/api/admin/registrations` | All entries + stats |
| PATCH | `/api/admin/registrations/:id` | `{ status?, notes? }` |
| DELETE | `/api/admin/registrations/:id` | Remove an entry |
| GET | `/api/admin/export.csv` | Download all entries |

The hero photo is `client/public/hero.jpg` (free Unsplash photo). Replace it with a photo of your own students/studio.
