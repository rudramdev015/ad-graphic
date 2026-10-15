import { Check, Quote } from 'lucide-react';
import { proof, studentStories, stats } from '../data/site.js';
import useCountUp from '../hooks/useCountUp.js';

function StoryCard({ s }) {
  if (s.type === 'quote') {
    return (
      <figure className="story story--quote">
        <Quote size={64} className="story-mark" />
        <blockquote>“{s.quote}”</blockquote>
        <figcaption>— {s.name}</figcaption>
      </figure>
    );
  }
  return (
    <figure className="story story--photo">
      <img src={s.photo} alt={`${s.name}, ${s.role}`} loading="lazy" />
      <figcaption>
        <span className="story-name"><i className="live-dot" /> {s.name}</span>
        <span className="story-co">
          <span className="story-logo">{s.company[0]}</span>
          <span><strong>{s.company}</strong><small>{s.role}</small></span>
        </span>
      </figcaption>
    </figure>
  );
}

function Column({ items, reverse }) {
  return (
    <div className={`story-col ${reverse ? 'story-col--rev' : ''}`}>
      <div className="story-track">
        {[...items, ...items].map((s, i) => <StoryCard key={i} s={s} />)}
      </div>
    </div>
  );
}

function Stat({ value, prefix = '', suffix, label }) {
  const [ref, n] = useCountUp(value);
  return (
    <div className="stat" ref={ref} data-reveal>
      <strong>{prefix}{n}<span>{suffix}</span></strong>
      <p>{label}</p>
    </div>
  );
}

export default function Results() {
  const colA = studentStories.filter((_, i) => i % 2 === 0);
  const colB = studentStories.filter((_, i) => i % 2 === 1);

  return (
    <section className="section results" id="results">
      <div className="results-glow" aria-hidden="true" />
      <div className="container results-grid">
        <div className="results-copy" data-reveal>
          <span className="results-numeral" aria-hidden="true">01</span>
          <h2>
            <span className="u-draw">{proof.heading[0]}</span><br />{proof.heading[1]}
          </h2>
          <ul className="proof-list">
            {proof.points.map((p, i) => (
              <li key={p} style={{ '--i': i }}><Check size={20} strokeWidth={3} /> {p}</li>
            ))}
          </ul>
          <p className="proof-note">{proof.footnote}</p>
        </div>

        <div className="stories" data-reveal>
          <Column items={colA} />
          <Column items={colB} reverse />
        </div>
      </div>

      <div className="container">
        <div className="stats-grid">
          {stats.map((s) => <Stat key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}
