import { ArrowRight } from 'lucide-react';
import { brand, advantages } from '../data/site.js';

export default function Advantages({ onApply }) {
  return (
    <section className="section section--panel">
      <div className="container adv">
        <div className="adv-intro" data-reveal>
          <span className="eyebrow">The {brand.short} advantage</span>
          <h2>Learn where the <span className="serif-accent">real work</span> happens.</h2>
          <p>
            You will not be practising on stock clips in a classroom. You will be inside a live creative
            studio, working on briefs that actually go out to clients.
          </p>
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
