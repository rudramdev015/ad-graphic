import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { fit } from '../data/site.js';

export default function Fit({ onApply }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Is this for you?</span>
          <h2>Be honest with <span className="serif-accent">yourself.</span></h2>
        </div>
        <div className="fit">
          <div className="card fit-card fit-card--yes" data-reveal>
            <h3>Claim a seat if…</h3>
            <ul>{fit.yes.map((t) => <li key={t}><CheckCircle2 size={20} /> {t}</li>)}</ul>
            <button className="btn btn-primary" onClick={onApply}>That’s me — apply <ArrowRight size={16} /></button>
          </div>
          <div className="card fit-card fit-card--no" data-reveal>
            <h3>Skip this if…</h3>
            <ul>{fit.no.map((t) => <li key={t}><XCircle size={20} /> {t}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
