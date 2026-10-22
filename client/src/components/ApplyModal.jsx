import { useEffect, useState } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { brand, labels, admissions } from '../data/site.js';

const empty = { name: '', email: '', phone: '', city: '', course: 'Design + Video (full program)', experience: '', goal: '' };

export default function ApplyModal({ open, onClose }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState('sending');
    setErrors({});
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        setMessage(data.error || 'Please fix the highlighted fields.');
        setState('error');
        return;
      }
      setState('done');
      setForm(empty);
    } catch {
      setMessage('Could not reach the server. Please try again.');
      setState('error');
    }
  }

  function close() {
    onClose();
    setTimeout(() => { setState('idle'); setMessage(''); setErrors({}); }, 300);
  }

  const field = (key, label, props = {}) => (
    <label className={`field ${errors[key] ? 'has-error' : ''}`}>
      <span>{label}</span>
      <input value={form[key]} onChange={set(key)} {...props} />
      {errors[key] && <small>{errors[key]}</small>}
    </label>
  );

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="apply-title">
        <button className="modal-close" onClick={close} aria-label="Close"><X size={20} /></button>

        {state === 'done' ? (
          <div className="modal-success">
            <CheckCircle2 size={56} />
            <h3>{labels().done}</h3>
            <p>Thanks! {admissions.successMessage}</p>
            <button className="btn btn-primary" onClick={close}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <span className="eyebrow">{brand.batch} · {brand.seats} seats</span>
            <h3 id="apply-title">{labels().title}</h3>
            <p className="modal-sub">Takes 60 seconds. No prior experience required — no payment now.</p>

            <div className="form-grid">
              {field('name', 'Full name', { placeholder: 'Your name', autoComplete: 'name' })}
              {field('email', 'Email', { type: 'email', placeholder: 'you@email.com', autoComplete: 'email' })}
              {field('phone', 'Phone / WhatsApp', { type: 'tel', placeholder: '+91 98765 43210', autoComplete: 'tel' })}
              {field('city', 'City', { placeholder: 'Where are you based?' })}
            </div>

            <div className="form-grid">
            <label className={`field ${errors.course ? 'has-error' : ''}`}>
              <span>Track</span>
              <select value={form.course} onChange={set('course')}>
                <option>Design + Video (full program)</option>
                <option>Graphic Design</option>
                <option>Video Editing</option>
              </select>
              {errors.course && <small>{errors.course}</small>}
            </label>
            <label className={`field ${errors.experience ? 'has-error' : ''}`}>
              <span>Editing experience</span>
              <select value={form.experience} onChange={set('experience')}>
                <option value="">Choose one</option>
                <option>Complete beginner</option>
                <option>Edited on my phone</option>
                <option>Some desktop editing</option>
                <option>Freelancing already</option>
              </select>
              {errors.experience && <small>{errors.experience}</small>}
            </label>
            </div>

            <label className="field">
              <span>Why do you want to join? <em>(optional)</em></span>
              <textarea rows={3} value={form.goal} onChange={set('goal')} placeholder="Tell us a little about your goals" />
            </label>

            {state === 'error' && message && <p className="form-error">{message}</p>}

            <button className="btn btn-primary btn-lg btn-block" disabled={state === 'sending'}>
              {state === 'sending' ? <><Loader2 size={18} className="spin" /> Submitting…</> : labels().submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
