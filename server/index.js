// Local server: `npm run dev` / `npm start`. On Vercel, api/index.js is used instead.
import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AD Graphic's server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin (after npm run build) or http://localhost:5173/admin in dev`);
});
