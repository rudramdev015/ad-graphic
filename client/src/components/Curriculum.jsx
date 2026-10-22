import { useEffect, useRef } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { curriculum, sessionFormat } from '../data/site.js';
import SectionHead from './SectionHead.jsx';

// One rich, dark tone per phase.
const tones = ['#a3262b', '#08393b', '#3b1d5e', '#0f2a55', '#5a3d06', '#5c0f2e', '#1f2a1a'];

export default function Curriculum() {
  const listRef = useRef(null);

  // As a later card slides over an earlier one, shrink + dim the earlier one.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const cards = [...list.querySelectorAll('.stack-card')];
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        let p = 0;
        if (next) {
          const top = card.getBoundingClientRect().top;
          const nextTop = next.getBoundingClientRect().top;
          // 0 when the next card is a full screen away, 1 when it has fully covered this one
          p = Math.min(1, Math.max(0, 1 - (nextTop - top) / (vh * 0.8)));
        }
        card.style.setProperty('--cover', p.toFixed(3));
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="section curriculum-sec" id="curriculum">
      <div className="container">
        <SectionHead k="curriculum" />

        <ol className="stack" ref={listRef}>
          {curriculum.map((c, i) => (
            <li
              key={c.phase}
              className="stack-card"
              style={{ '--i': i, '--tone': tones[i % tones.length] }}
            >
              <div className="stack-copy">
                <span className="stack-phase">Phase {i + 1} <em>· {c.weeks}</em></span>
                <h3>{c.title}</h3>
                <ul>
                  {c.points.map((p) => <li key={p}><CheckCircle2 size={20} /> {p}</li>)}
                </ul>
              </div>
              <figure className="stack-media">
                <img src={c.image} alt="" loading="lazy" />
                <span className="stack-num" aria-hidden="true">{c.phase}</span>
              </figure>
            </li>
          ))}
        </ol>

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
