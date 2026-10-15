import { Check, Clock } from 'lucide-react';
import { curriculum, sessionFormat } from '../data/site.js';

export default function Curriculum() {
  return (
    <section className="section" id="curriculum">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Curriculum</span>
          <h2>Your road to <span className="serif-accent">professional editing.</span></h2>
          <p>Seven focused phases that take you from your first cut to your first paycheque.</p>
        </div>

        <div className="timeline-v">
          {curriculum.map((c) => (
            <article className="phase" key={c.phase} data-reveal>
              <span className="phase-dot">{c.phase}</span>
              <div className="card phase-card">
                <div className="phase-top">
                  <h3>{c.title}</h3>
                  <span className="tag">{c.weeks}</span>
                </div>
                <ul>
                  {c.points.map((p) => <li key={p}><Check size={16} /> {p}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="format" data-reveal>
          <h3><Clock size={20} /> What a typical day looks like</h3>
          <div className="format-grid">
            {sessionFormat.map((s) => (
              <div className="format-item" key={s.title}>
                <strong>{s.hours}</strong>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
