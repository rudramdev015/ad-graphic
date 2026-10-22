import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Save, RotateCcw, Plus, Trash2, ArrowUp, ArrowDown, Copy, Upload, Loader2, ExternalLink, ChevronDown, Check, Circle,
  Megaphone, Building2, Image, Trophy, Sparkles, Layers, Film, IndianRupee, HelpCircle, Columns3, Wrench, Heading,
} from 'lucide-react';
import { DEFAULTS } from '../data/site.js';
import { TABS, emptyFor } from './contentSchema.js';
import { uploadMedia } from './upload.js';

const Icons = { Megaphone, Building2, Image, Trophy, Sparkles, Layers, Film, IndianRupee, HelpCircle, Columns3, Wrench, Heading, Circle };

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
function deepMerge(base, over) {
  if (Array.isArray(over)) return structuredClone(over);
  if (!isObj(base) || !isObj(over)) return over === undefined ? structuredClone(base) : over;
  const out = structuredClone(base);
  for (const [k, v] of Object.entries(over)) out[k] = isObj(v) && isObj(out[k]) ? deepMerge(out[k], v) : structuredClone(v);
  return out;
}
const valueFor = (content, key) => (content[key] === undefined ? structuredClone(DEFAULTS[key]) : deepMerge(DEFAULTS[key], content[key]));

/* ================================================================== */

export default function ContentAdmin({ api, token, toast }) {
  const [content, setContent] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [tab, setTab] = useState('admissions');
  const [saving, setSaving] = useState('');

  const load = useCallback(async () => {
    const res = await api('/api/admin/content');
    const d = await res.json();
    setContent(d.content || {});
    setDrafts({});
  }, [api]);
  useEffect(() => { load().catch(() => {}); }, [load]);

  const current = (key) => drafts[key] ?? (content ? valueFor(content, key) : structuredClone(DEFAULTS[key]));
  const dirty = (key) => drafts[key] !== undefined && JSON.stringify(drafts[key]) !== JSON.stringify(valueFor(content || {}, key));
  const setDraft = (key, value) => setDrafts((d) => ({ ...d, [key]: value }));

  async function save(key) {
    setSaving(key);
    try {
      const res = await api(`/api/admin/content/${key}`, { method: 'PUT', body: JSON.stringify({ value: current(key) }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Save failed');
      setContent(d.content);
      setDrafts((all) => { const n = { ...all }; delete n[key]; return n; });
      toast('Saved — live on the website');
    } catch (err) {
      toast(err.message);
    } finally {
      setSaving('');
    }
  }

  async function reset(key) {
    if (!window.confirm('Reset this part of the website to the original default content?')) return;
    const res = await api(`/api/admin/content/${key}`, { method: 'DELETE' });
    const d = await res.json();
    if (!res.ok) return toast(d.error || 'Reset failed');
    setContent(d.content);
    setDrafts((all) => { const n = { ...all }; delete n[key]; return n; });
    toast('Reset to default');
  }

  const active = TABS.find((x) => x.id === tab) || TABS[0];
  const unsaved = Object.keys(drafts).filter(dirty);

  useEffect(() => {
    if (!unsaved.length) return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [unsaved.length]);

  if (!content) return <div className="adm-card adm-empty"><Loader2 size={28} className="adm-spin" /></div>;

  return (
    <>
      <header className="adm-top">
        <div>
          <h1>Website content</h1>
          <p>Edit text, photos and videos on every section. Changes go live as soon as you save.</p>
        </div>
        <div className="adm-top-actions">
          <a className="adm-btn" href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> <span>View website</span></a>
        </div>
      </header>

      <nav className="cm-tabs" aria-label="Content sections">
        {TABS.map((x) => {
          const Icon = Icons[x.icon] || Icons.Circle;
          const hasUnsaved = x.blocks.some((b) => unsaved.includes(b.key));
          return (
            <button key={x.id} className={x.id === tab ? 'on' : ''} onClick={() => setTab(x.id)}>
              <Icon size={16} /> {x.label}{hasUnsaved && <i className="cm-dot" title="Unsaved changes" />}
            </button>
          );
        })}
      </nav>

      {active.blocks.map((block) => {
        const value = current(block.key);
        const isDirty = dirty(block.key);
        const overridden = content[block.key] !== undefined;
        return (
          <section key={block.key} className={`adm-card cm-block ${isDirty ? 'is-dirty' : ''}`}>
            <div className="cm-block-head">
              <div>
                <h3>{block.title}</h3>
                {block.desc && <p>{block.desc}</p>}
              </div>
              <span className={`cm-state ${isDirty ? 'warn' : overridden ? 'ok' : ''}`}>
                {isDirty ? 'Unsaved changes' : overridden ? <><Check size={13} /> Customised</> : 'Default'}
              </span>
            </div>

            {block.type === 'objects' ? (
              <ObjectsField field={{ ...block, k: block.key }} value={value} onChange={(v) => setDraft(block.key, v)} token={token} />
            ) : block.type === 'list' ? (
              <ListField field={{ k: block.key }} value={value} onChange={(v) => setDraft(block.key, v)} />
            ) : (
              <Fields fields={block.fields} value={value} onChange={(v) => setDraft(block.key, v)} token={token} />
            )}

            <div className="cm-actions">
              <button className="adm-btn" onClick={() => reset(block.key)} disabled={!overridden && !isDirty}>
                <RotateCcw size={15} /> Reset to default
              </button>
              {isDirty && (
                <button className="adm-btn" onClick={() => setDrafts((d) => { const n = { ...d }; delete n[block.key]; return n; })}>Discard</button>
              )}
              <button className="adm-btn adm-btn--primary" onClick={() => save(block.key)} disabled={!isDirty || saving === block.key}>
                {saving === block.key ? <Loader2 size={15} className="adm-spin" /> : <Save size={15} />} Save
              </button>
            </div>
          </section>
        );
      })}

      {unsaved.length > 0 && (
        <div className="cm-unsaved">
          {unsaved.length} section{unsaved.length > 1 ? 's' : ''} with unsaved changes
          <button className="adm-btn adm-btn--primary" onClick={() => unsaved.forEach(save)}><Save size={15} /> Save all</button>
        </div>
      )}
    </>
  );
}

/* ================================================================== */

function Fields({ fields, value, onChange, token }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="cm-fields">
      {fields.map((f) => <Field key={f.k} field={f} value={value?.[f.k]} onChange={(v) => set(f.k, v)} token={token} />)}
    </div>
  );
}

function Field({ field, value, onChange, token }) {
  const wide = ['textarea', 'list', 'objects', 'object', 'image', 'video', 'mode'].includes(field.type);
  return (
    <div className={`cm-field ${wide ? 'wide' : ''} cm-field--${field.type}`}>
      <label className="cm-label">{field.label}</label>
      <Input field={field} value={value} onChange={onChange} token={token} />
      {field.hint && <small className="cm-hint">{field.hint}</small>}
    </div>
  );
}

function Input({ field, value, onChange, token }) {
  switch (field.type) {
    case 'textarea':
      return <textarea className="cm-input" rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'number':
      return <input className="cm-input" type="number" inputMode="decimal" value={value ?? 0} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />;
    case 'bool':
      return (
        <label className="tm-switch">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span /> {value ? 'On' : 'Off'}
        </label>
      );
    case 'select':
      return (
        <select className="cm-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {field.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      );
    case 'mode':
      return <ModePicker value={value} onChange={onChange} />;
    case 'image':
    case 'video':
      return <MediaInput kind={field.type} value={value ?? ''} onChange={onChange} token={token} />;
    case 'list':
      return <ListField field={field} value={value} onChange={onChange} />;
    case 'objects':
      return <ObjectsField field={field} value={value} onChange={onChange} token={token} />;
    case 'object':
      return <div className="cm-sub"><Fields fields={field.fields} value={value || {}} onChange={onChange} token={token} /></div>;
    default:
      return <input className="cm-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
}

const MODES = [
  ['pre-register', 'Pre-Register', 'Collect interest before admissions open.'],
  ['register', 'Register', 'Admissions are open — take full registrations.'],
  ['closed', 'Waitlist', 'Batch full — collect a waitlist instead.'],
];

function ModePicker({ value, onChange }) {
  return (
    <div className="cm-modes" role="radiogroup">
      {MODES.map(([v, title, text]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} className={value === v ? 'on' : ''} onClick={() => onChange(v)}>
          <strong>{title}</strong>
          <span>{text}</span>
        </button>
      ))}
    </div>
  );
}

function MediaInput({ kind, value, onChange, token }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(null);
  const [err, setErr] = useState('');
  const accept = kind === 'image' ? 'image/jpeg,image/png,image/webp,image/svg+xml' : 'video/mp4,video/webm,video/quicktime';

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErr(''); setProgress(0);
    try {
      const d = await uploadMedia(file, token, setProgress);
      onChange(d.url);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="cm-media">
      <div className="cm-media-preview">
        {value ? (kind === 'image' ? <img src={value} alt="" /> : <video src={value} muted playsInline preload="metadata" />) : <span>No {kind}</span>}
      </div>
      <div className="cm-media-ctl">
        <input className="cm-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={`Paste ${kind} URL or upload`} />
        <button type="button" className="adm-btn" onClick={() => ref.current?.click()} disabled={progress !== null}>
          {progress !== null ? <Loader2 size={15} className="adm-spin" /> : <Upload size={15} />} Upload {kind}
        </button>
        <input ref={ref} type="file" accept={accept} hidden onChange={pick} />
        {progress !== null && <div className="tm-progress"><i style={{ width: `${progress}%` }} /><b>{progress}%</b></div>}
        {err && <small className="tm-err">{err}</small>}
      </div>
    </div>
  );
}

function ListField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const set = (i, v) => onChange(items.map((x, j) => (j === i ? v : x)));
  const move = (i, d) => { const n = [...items]; [n[i], n[i + d]] = [n[i + d], n[i]]; onChange(n); };
  const canAdd = !field.max || items.length < field.max;
  return (
    <div className="cm-list">
      {items.map((v, i) => (
        <div className="cm-list-row" key={i}>
          <input className="cm-input" value={v ?? ''} onChange={(e) => set(i, e.target.value)} />
          <div className="cm-row-btns">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp size={14} /></button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"><ArrowDown size={14} /></button>
            <button type="button" className="danger" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
      {canAdd && <button type="button" className="cm-add" onClick={() => onChange([...items, ''])}><Plus size={14} /> Add item</button>}
    </div>
  );
}

function ObjectsField({ field, value, onChange, token }) {
  const items = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState(() => new Set());
  const toggle = (i) => setOpen((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const move = (i, d) => { const n = [...items]; [n[i], n[i + d]] = [n[i + d], n[i]]; onChange(n); };
  const blank = useMemo(() => Object.fromEntries(field.fields.map((f) => [f.k, emptyFor(f)])), [field.fields]);
  const title = (item, i) => (field.itemTitle ? field.itemTitle(item) : item?.[field.fields[0].k]) || `Item ${i + 1}`;

  return (
    <div className="cm-objs">
      {items.map((item, i) => (
        <div className={`cm-obj ${open.has(i) ? 'open' : ''}`} key={i}>
          <div className="cm-obj-head">
            <button type="button" className="cm-obj-title" onClick={() => toggle(i)}>
              <ChevronDown size={16} className="cm-chev" /> <span>{title(item, i)}</span>
            </button>
            <div className="cm-row-btns">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"><ArrowDown size={14} /></button>
              <button type="button" onClick={() => onChange([...items.slice(0, i + 1), structuredClone(item), ...items.slice(i + 1)])} aria-label="Duplicate"><Copy size={14} /></button>
              <button type="button" className="danger" onClick={() => window.confirm('Remove this item?') && onChange(items.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          </div>
          {open.has(i) && (
            <div className="cm-obj-body">
              <Fields fields={field.fields} value={item} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} token={token} />
            </div>
          )}
        </div>
      ))}
      <button type="button" className="cm-add" onClick={() => { onChange([...items, structuredClone(blank)]); setOpen((s) => new Set(s).add(items.length)); }}>
        <Plus size={14} /> Add {field.itemName || 'item'}
      </button>
    </div>
  );
}
