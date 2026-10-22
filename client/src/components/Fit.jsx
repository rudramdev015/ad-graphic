import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { fit, labels } from '../data/site.js';
import SectionHead from './SectionHead.jsx';

export default function Fit({ onApply }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHead k="fit" accent="serif-accent" />
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
