import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const Admin = lazy(() => import('./admin/Admin.jsx'));
const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={<div className="adm-boot" />}><Admin /></Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
