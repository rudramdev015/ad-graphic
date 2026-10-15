import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LogOut, RefreshCw, Eye, EyeOff, Download, Search, Users, CalendarClock, PhoneCall, GraduationCap, Mail,
  X, Trash2, Lock, Loader2, ArrowUpRight, Inbox, MessageCircle, Film,
} from 'lucide-react';
import TestimonialsAdmin from './TestimonialsAdmin.jsx';
import { Mark } from '../components/Logo.jsx';
import { brand } from '../data/site.js';
import './admin.css';

const TOKEN_KEY = 'adg_admin_token';
const STATUS_META = {
  new: { label: 'New', tone: 'yellow' },
  contacted: { label: 'Contacted', tone: 'blue' },
  interview: { label: 'Interview', tone: 'violet' },
  enrolled: { label: 'Enrolled', tone: 'green' },
  rejected: { label: 'Rejected', tone: 'red' },
};

const getToken = () => { try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } };
const setToken = (t) => { try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } };

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
const fmtDate = (iso) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
const initials = (n = '') => n.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '✉';

/* ------------------------------------------------------------------ */

export default function Admin() {
  const [token, setTok] = useState(getToken);
  useEffect(() => { document.title = `Admin · ${brand.name}`; }, []);
  const logout = () => { setToken(''); setTok(''); };
  return token ? <Dashboard token={token} onLogout={logout} /> : <Login onLogin={(t) => { setToken(t); setTok(t); }} />;
}

/* ------------------------------------------------------------------ */

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);
  const [success, setSuccess] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setSuccess(true);
      setTimeout(() => onLogin(data.token), 1100); // let the success animation play
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Cannot reach the server. Is it running?' : err.message);
      setShake((n) => n + 1);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`adm adm-login ${success ? 'is-success' : ''}`}>
      <div className="adm-login-bg" aria-hidden="true">
        <span className="orb orb--1" /><span className="orb orb--2" /><span className="orb orb--3" />
        <div className="adm-login-grid" />
      </div>

      <form key={shake} className={`adm-login-card ${shake ? 'shake' : ''}`} onSubmit={submit}>
        {success ? (
          <div className="adm-welcome">
            <span className="adm-welcome-check">
              <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
            </span>
            <h1>Welcome back!</h1>
            <p>Opening your dashboard…</p>
          </div>
        ) : (
          <>
            <div className="adm-login-logo"><span className="halo" /><Mark size={68} /></div>
            <h1 className="stagger" style={{ '--s': 1 }}>{brand.name}</h1>
            <p className="stagger" style={{ '--s': 2 }}>Admin dashboard — sign in to manage pre-registrations.</p>
            <label className="adm-input stagger" style={{ '--s': 3 }}>
              <Lock size={18} />
              <input type={show ? 'text' : 'password'} placeholder="Admin password" value={password} autoFocus
                onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
                autoCapitalize="off" autoCorrect="off" spellCheck={false} />
              <button type="button" className="adm-eye" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
            {error && <div className="adm-error" role="alert">{error}</div>}
            <button className="adm-btn adm-btn--primary adm-btn--block adm-signin stagger" style={{ '--s': 4 }} disabled={busy || !password}>
              {busy ? <Loader2 size={18} className="adm-spin" /> : <>Sign in <ArrowUpRight size={18} /></>}
            </button>
            <a href="/" className="adm-back stagger" style={{ '--s': 5 }}>← Back to website</a>
          </>
        )}
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Dashboard({ token, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('registration');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');

  const api = useCallback(async (url, opts = {}) => {
    const res = await fetch(url, {
      ...opts,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
    });
    if (res.status === 401) { onLogout(); throw new Error('Session expired'); }
    return res;
  }, [token, onLogout]);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const res = await api('/api/admin/registrations');
      setData(await res.json());
    } catch { /* handled */ } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { load(); const t = setInterval(() => load(true), 30000); return () => clearInterval(t); }, [load]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t); }, [toast]);

  async function update(id, patch) {
    const res = await api(`/api/admin/registrations/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
    const out = await res.json();
    if (!res.ok) return setToast(out.error || 'Update failed');
    setData((d) => ({ ...d, entries: d.entries.map((e) => (e.id === id ? out.entry : e)) }));
    setSelected((s) => (s && s.id === id ? out.entry : s));
    setToast('Saved');
    load(true);
  }

  async function remove(id) {
    if (!window.confirm('Delete this entry permanently?')) return;
    const res = await api(`/api/admin/registrations/${id}`, { method: 'DELETE' });
    if (!res.ok) return setToast('Delete failed');
    setSelected(null);
    setToast('Deleted');
    load(true);
  }

  async function exportCsv() {
    const res = await api('/api/admin/export.csv');
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const entries = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.entries.filter((e) =>
      e.type === type &&
      (status === 'all' || e.status === status) &&
      (!q || [e.name, e.email, e.phone, e.city, e.course].some((v) => (v || '').toLowerCase().includes(q))));
  }, [data, query, status, type]);

  const s = data?.stats;
  const maxDay = Math.max(1, ...(s?.byDay || []).map((d) => d.count));

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-brand"><Mark size={40} /><div><strong>{brand.short}</strong><small>Admin {brand.version}</small></div></div>
        <nav>
          <button className={type === 'registration' ? 'active' : ''} onClick={() => setType('registration')}>
            <Users size={18} /> Pre-registrations <em>{s?.total ?? '–'}</em>
          </button>
          <button className={type === 'brochure' ? 'active' : ''} onClick={() => setType('brochure')}>
            <Mail size={18} /> Brochure requests <em>{s?.brochures ?? '–'}</em>
          </button>
          <button className={type === 'testimonials' ? 'active' : ''} onClick={() => setType('testimonials')}>
            <Film size={18} /> Video testimonials
          </button>
        </nav>
        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noreferrer"><ArrowUpRight size={16} /> View website</a>
          <button onClick={onLogout}><LogOut size={16} /> Sign out</button>
        </div>
      </aside>

      <main className="adm-main">
        {type === 'testimonials' ? (
          <TestimonialsAdmin api={api} token={token} toast={setToast} />
        ) : (<>
        <header className="adm-top">
          <div>
            <h1>{type === 'registration' ? 'Pre-registrations' : 'Brochure requests'}</h1>
            <p>{brand.batch} · auto-refreshes every 30s</p>
          </div>
          <div className="adm-top-actions">
            <button className="adm-btn" onClick={() => load()} title="Refresh">
              <RefreshCw size={16} className={loading ? 'adm-spin' : ''} /> <span>Refresh</span>
            </button>
            <button className="adm-btn adm-btn--primary" onClick={exportCsv}><Download size={16} /> <span>Export CSV</span></button>
            <button className="adm-btn adm-only-mobile" onClick={onLogout} title="Sign out"><LogOut size={16} /></button>
          </div>
        </header>

        <section className="adm-stats">
          <Stat icon={Users} label="Total pre-registrations" value={s?.total} tone="yellow" />
          <Stat icon={CalendarClock} label="New today" value={s?.today} tone="red" />
          <Stat icon={PhoneCall} label="Contacted / interview" value={s ? s.byStatus.contacted + s.byStatus.interview : undefined} tone="blue" />
          <Stat icon={GraduationCap} label="Enrolled" value={s?.byStatus.enrolled} tone="green" />
        </section>

        <section className="adm-grid">
          <div className="adm-card adm-chart">
            <div className="adm-card-head"><h3>Last 14 days</h3><span>{s?.byDay.reduce((a, d) => a + d.count, 0) ?? 0} total</span></div>
            <div className="adm-bars">
              {(s?.byDay || []).map((d) => (
                <div className="adm-bar" key={d.date} title={`${d.date}: ${d.count}`}>
                  <span className="adm-bar-val">{d.count || ''}</span>
                  <i style={{ height: `${(d.count / maxDay) * 100}%` }} />
                  <small>{new Date(d.date).getDate()}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="adm-card adm-pipeline">
            <div className="adm-card-head"><h3>Pipeline</h3></div>
            {Object.entries(STATUS_META).map(([key, m]) => {
              const n = s?.byStatus[key] ?? 0;
              const pct = s?.total ? Math.round((n / s.total) * 100) : 0;
              return (
                <button key={key} className={`adm-pipe ${status === key ? 'on' : ''}`} onClick={() => { setType('registration'); setStatus(status === key ? 'all' : key); }}>
                  <span className={`adm-dot tone-${m.tone}`} /> {m.label}
                  <b>{n}</b>
                  <span className="adm-pipe-track"><i className={`tone-${m.tone}`} style={{ width: `${pct}%` }} /></span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="adm-card adm-table-card">
          <div className="adm-toolbar">
            <label className="adm-search">
              <Search size={17} />
              <input placeholder="Search name, email, phone, city…" value={query} onChange={(e) => setQuery(e.target.value)} />
              {query && <button onClick={() => setQuery('')}><X size={15} /></button>}
            </label>
            {type === 'registration' && (
              <div className="adm-chips">
                {['all', ...Object.keys(STATUS_META)].map((k) => (
                  <button key={k} className={status === k ? 'on' : ''} onClick={() => setStatus(k)}>
                    {k === 'all' ? 'All' : STATUS_META[k].label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading && !data ? (
            <div className="adm-empty"><Loader2 size={28} className="adm-spin" /></div>
          ) : entries.length === 0 ? (
            <div className="adm-empty"><Inbox size={36} /><p>No entries yet{query || status !== 'all' ? ' for this filter' : ''}.</p></div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>Student</th><th>Contact</th><th>Track</th><th>Experience</th><th>Status</th><th>Received</th></tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr key={e.id} onClick={() => setSelected(e)}>
                      <td data-label="Student">
                        <div className="adm-person">
                          <span className="adm-avatar">{initials(e.name)}</span>
                          <div><strong>{e.name || e.email}</strong><small>{e.city || '—'}</small></div>
                        </div>
                      </td>
                      <td data-label="Contact"><div className="adm-contact"><span>{e.email}</span><small>{e.phone || '—'}</small></div></td>
                      <td data-label="Track">{e.course || '—'}</td>
                      <td data-label="Experience">{e.experience || '—'}</td>
                      <td data-label="Status" onClick={(ev) => ev.stopPropagation()}>
                        <StatusSelect value={e.status} onChange={(v) => update(e.id, { status: v })} />
                      </td>
                      <td data-label="Received" title={fmtDate(e.createdAt)}>{timeAgo(e.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        </>)}
      </main>

      {selected && <Drawer entry={selected} onClose={() => setSelected(null)} onUpdate={update} onDelete={remove} />}
      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  );
}

function CountUp({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (value == null) return;
    let raf; const from = 0; const t0 = performance.now();
    const tick = (t) => { const p = Math.min((t - t0) / 900, 1); setN(Math.round(from + (value - from) * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return value == null ? '–' : n;
}

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className={`adm-card adm-stat tone-${tone}`}>
      <span className="adm-stat-ico"><Icon size={20} /></span>
      <strong><CountUp value={value} /></strong>
      <p>{label}</p>
    </div>
  );
}

function StatusSelect({ value, onChange }) {
  return (
    <select className={`adm-status tone-${STATUS_META[value]?.tone || 'yellow'}`} value={value} onChange={(e) => onChange(e.target.value)}>
      {Object.entries(STATUS_META).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
    </select>
  );
}

function Drawer({ entry, onClose, onUpdate, onDelete }) {
  const [notes, setNotes] = useState(entry.notes || '');
  useEffect(() => setNotes(entry.notes || ''), [entry.id, entry.notes]);
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  const phoneDigits = (entry.phone || '').replace(/\D/g, '');
  const wa = phoneDigits ? `https://wa.me/${phoneDigits.length === 10 ? '91' + phoneDigits : phoneDigits}` : null;

  return (
    <div className="adm-drawer-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="adm-drawer">
        <button className="adm-drawer-x" onClick={onClose}><X size={20} /></button>
        <div className="adm-drawer-head">
          <span className="adm-avatar adm-avatar--lg">{initials(entry.name)}</span>
          <div><h2>{entry.name || entry.email}</h2><small>Received {fmtDate(entry.createdAt)}</small></div>
        </div>

        <div className="adm-quick">
          {entry.phone && <a className="adm-btn" href={`tel:${entry.phone}`}><PhoneCall size={16} /> Call</a>}
          {wa && <a className="adm-btn adm-btn--wa" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a>}
          <a className="adm-btn" href={`mailto:${entry.email}`}><Mail size={16} /> Email</a>
        </div>

        <dl className="adm-dl">
          {[['Email', entry.email], ['Phone', entry.phone], ['City', entry.city], ['Track', entry.course], ['Experience', entry.experience]]
            .map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || '—'}</dd></div>)}
          {entry.goal && <div className="full"><dt>Why they want to join</dt><dd>{entry.goal}</dd></div>}
        </dl>

        <label className="adm-field">
          <span>Status</span>
          <StatusSelect value={entry.status} onChange={(v) => onUpdate(entry.id, { status: v })} />
        </label>
        <label className="adm-field">
          <span>Internal notes</span>
          <textarea rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Call summary, interview slot, follow-ups…" />
        </label>
        <div className="adm-drawer-actions">
          <button className="adm-btn adm-btn--danger" onClick={() => onDelete(entry.id)}><Trash2 size={16} /> Delete</button>
          <button className="adm-btn adm-btn--primary" disabled={notes === (entry.notes || '')} onClick={() => onUpdate(entry.id, { notes })}>Save notes</button>
        </div>
      </aside>
    </div>
  );
}
