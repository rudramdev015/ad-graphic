import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Upload, X, Loader2, Film, Image as ImageIcon, Youtube, Play,
} from 'lucide-react';

const empty = { name: '', role: '', quote: '', poster: '', video: '', published: true };
const isYouTube = (u) => /youtube\.com|youtu\.be/i.test(u || '');

import { uploadMedia as uploadFile } from './upload.js';

export default function TestimonialsAdmin({ api, token, toast }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | item

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api('/api/admin/testimonials');
      const d = await res.json();
      setList(d.testimonials || []);
    } catch { /* handled by api */ } finally { setLoading(false); }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  async function save(form) {
    const isNew = editing === 'new';
    const res = await api(isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${editing.id}`, {
      method: isNew ? 'POST' : 'PUT', body: JSON.stringify(form),
    });
    const d = await res.json();
    if (!res.ok) return d.errors || { _: d.error || 'Save failed' };
    toast(isNew ? 'Testimonial added' : 'Testimonial updated');
    setEditing(null);
    load();
    return null;
  }

  async function togglePublish(t) {
    await api(`/api/admin/testimonials/${t.id}`, { method: 'PUT', body: JSON.stringify({ ...t, published: !t.published }) });
    toast(t.published ? 'Hidden from website' : 'Published');
    load();
  }

  async function remove(t) {
    if (!window.confirm(`Delete testimonial from ${t.name}?`)) return;
    await api(`/api/admin/testimonials/${t.id}`, { method: 'DELETE' });
    toast('Deleted');
    load();
  }

  async function move(i, dir) {
    const next = [...list];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
    await api('/api/admin/testimonials/reorder', { method: 'POST', body: JSON.stringify({ ids: next.map((t) => t.id) }) });
  }

  return (
    <>
      <header className="adm-top">
        <div>
          <h1>Video testimonials</h1>
          <p>{list.filter((t) => t.published).length} live on the website · drag-free ordering with arrows</p>
        </div>
        <div className="adm-top-actions">
          <a className="adm-btn" href="/#testimonials" target="_blank" rel="noreferrer"><Eye size={16} /> <span>Preview</span></a>
          <button className="adm-btn adm-btn--primary" onClick={() => setEditing('new')}><Plus size={16} /> <span>Add testimonial</span></button>
        </div>
      </header>

      {loading && !list.length ? (
        <div className="adm-card adm-empty"><Loader2 size={28} className="adm-spin" /></div>
      ) : !list.length ? (
        <div className="adm-card adm-empty"><Film size={36} /><p>No testimonials yet. Add your first one.</p></div>
      ) : (
        <div className="tm-grid">
          {list.map((t, i) => (
            <article key={t.id} className={`tm-card ${t.published ? '' : 'is-hidden'}`}>
              <div className="tm-thumb">
                {t.poster ? <img src={t.poster} alt="" /> : <span className="tm-initial">{t.name[0]}</span>}
                <span className="tm-badge">{isYouTube(t.video) ? <><Youtube size={12} /> YouTube</> : <><Film size={12} /> MP4</>}</span>
                {!t.published && <span className="tm-hidden-tag"><EyeOff size={12} /> Hidden</span>}
                <span className="tm-order">#{i + 1}</span>
              </div>
              <div className="tm-body">
                <strong>{t.name}</strong>
                <small>{t.role}</small>
                <p>“{t.quote}”</p>
              </div>
              <div className="tm-actions">
                <button title="Move up" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp size={16} /></button>
                <button title="Move down" onClick={() => move(i, 1)} disabled={i === list.length - 1}><ArrowDown size={16} /></button>
                <button title={t.published ? 'Hide' : 'Publish'} onClick={() => togglePublish(t)}>{t.published ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                <button title="Edit" onClick={() => setEditing(t)}><Pencil size={16} /></button>
                <button title="Delete" className="danger" onClick={() => remove(t)}><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <Editor
          initial={editing === 'new' ? empty : editing}
          isNew={editing === 'new'}
          token={token}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */

function MediaField({ label, kind, value, onChange, token, error }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null);
  const [err, setErr] = useState('');
  const accept = kind === 'image' ? 'image/jpeg,image/png,image/webp' : 'video/mp4,video/webm,video/quicktime';

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErr(''); setProgress(0);
    try {
      const d = await uploadFile(file, token, setProgress);
      onChange(d.url);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setProgress(null);
    }
  }

  return (
    <label className={`adm-field ${error ? 'has-err' : ''}`}>
      <span>{label}</span>
      <div className="tm-media">
        <input
          className="tm-url" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={kind === 'image' ? 'Paste image URL or upload →' : 'Paste MP4 / YouTube link or upload →'}
        />
        <button type="button" className="adm-btn" onClick={() => inputRef.current?.click()} disabled={progress !== null}>
          {progress !== null ? <Loader2 size={16} className="adm-spin" /> : <Upload size={16} />} Upload
        </button>
        <input ref={inputRef} type="file" accept={accept} hidden onChange={pick} />
      </div>
      {progress !== null && <div className="tm-progress"><i style={{ width: `${progress}%` }} /><b>{progress}%</b></div>}
      {(err || error) && <small className="tm-err">{err || error}</small>}
    </label>
  );
}

function Editor({ initial, isNew, token, onClose, onSave }) {
  const [form, setForm] = useState({ ...empty, ...initial });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));

  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const errs = await onSave(form);
    setBusy(false);
    if (errs) setErrors(errs);
  }

  const yt = isYouTube(form.video);

  return (
    <div className="adm-drawer-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="adm-drawer tm-editor" onSubmit={submit}>
        <button type="button" className="adm-drawer-x" onClick={onClose}><X size={20} /></button>
        <div className="adm-drawer-head"><div><h2>{isNew ? 'Add testimonial' : 'Edit testimonial'}</h2><small>Shown in the “What our students say” carousel</small></div></div>

        {/* live mini preview */}
        <div className="tm-preview">
          <div className="tm-preview-thumb">
            {form.poster ? <img src={form.poster} alt="" /> : <span className="tm-initial">{(form.name || '?')[0]}</span>}
            <span className="tm-preview-play"><Play size={16} fill="currentColor" /></span>
            <div className="tm-lower"><b>{form.name || 'Student name'}</b><i>{form.role || 'Role'}</i></div>
          </div>
          <p>“{form.quote || 'Their quote will appear here.'}”</p>
        </div>

        <div className="tm-row">
          <label className={`adm-field ${errors.name ? 'has-err' : ''}`}>
            <span>Student name</span>
            <input className="tm-url" value={form.name} onChange={set('name')} placeholder="e.g. Aarav Mehta" />
            {errors.name && <small className="tm-err">{errors.name}</small>}
          </label>
          <label className={`adm-field ${errors.role ? 'has-err' : ''}`}>
            <span>Role / job title</span>
            <input className="tm-url" value={form.role} onChange={set('role')} placeholder="e.g. Freelance Video Editor" />
            {errors.role && <small className="tm-err">{errors.role}</small>}
          </label>
        </div>

        <label className={`adm-field ${errors.quote ? 'has-err' : ''}`}>
          <span>Quote <em>({form.quote.length}/400)</em></span>
          <textarea rows={3} maxLength={400} value={form.quote} onChange={set('quote')} placeholder="One or two sentences in their words" />
          {errors.quote && <small className="tm-err">{errors.quote}</small>}
        </label>

        <MediaField label={<><ImageIcon size={14} /> Poster image (optional)</>} kind="image" value={form.poster} onChange={set('poster')} token={token} error={errors.poster} />
        <MediaField label={<><Film size={14} /> Video {yt && <em className="tm-yt">YouTube detected{/shorts\//i.test(form.video) ? ' · Shorts (9:16)' : ''}</em>}</>} kind="video" value={form.video} onChange={set('video')} token={token} error={errors.video} />

        <label className="tm-switch">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
          <span /> Show on website
        </label>

        {errors._ && <div className="adm-error">{errors._}</div>}

        <div className="adm-drawer-actions">
          <button type="button" className="adm-btn" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn--primary" disabled={busy}>
            {busy ? <Loader2 size={16} className="adm-spin" /> : null} {isNew ? 'Add testimonial' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
