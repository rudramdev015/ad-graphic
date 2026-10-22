import { ArrowRight } from 'lucide-react';
import { advantages, sections, fill } from '../data/site.js';

export default function Advantages({ onApply }) {
  return (
    <section className="section section--panel">
      <div className="container adv">
        <div className="adv-intro" data-reveal>
          <span className="eyebrow">{fill(sections.advantages.eyebrow)}</span>
          <h2>{fill(sections.advantages.title)} <span className="serif-accent">{fill(sections.advantages.highlight)}</span> {fill(sections.advantages.after)}</h2>
          <p>{fill(sections.advantages.sub)}</p>
          <button className="btn btn-primary" onClick={onApply}>Claim your seat <ArrowRight size={16} /></button>
        </div>
        <ol className="adv-list">
          {advantages.map((a, i) => (
            <li key={a.title} data-reveal>
              <span className="adv-num">{String(i + 1).padStart(2, '0')}</span>
              <div><h4>{a.title}</h4><p>{a.text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
