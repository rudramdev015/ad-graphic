import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { applyContent } from './data/site.js';
import './styles.css';

const Admin = lazy(() => import('./admin/Admin.jsx'));
const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin';

// Load content edited in Admin → Website content before the first render.
// Falls back to the built-in defaults if the API is slow or unreachable.
async function loadContent() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch('/api/content', { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) applyContent((await res.json()).content);
  } catch { /* use defaults */ }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

if (isAdmin) {
  root.render(
    <React.StrictMode>
      <Suspense fallback={<div className="adm-boot" />}><Admin /></Suspense>
    </React.StrictMode>
  );
} else {
  loadContent().then(() => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
}
