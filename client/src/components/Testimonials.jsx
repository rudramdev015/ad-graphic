import { Quote, Play } from 'lucide-react';
import { testimonials } from '../data/site.js';

const initials = (n) => n.split(' ').map((p) => p[0]).join('');

export default function Testimonials() {
  const row = [...testimonials, ...testimonials];
  return (
    <section className="section section--tight">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Student stories</span>
          <h2>Hear it from <span className="serif-accent">our graduates.</span></h2>
        </div>
      </div>
      <div className="marquee" data-reveal>
        <div className="marquee-track">
          {row.map((t, i) => (
            <figure className="testimonial" key={i} aria-hidden={i >= testimonials.length}>
              <Quote size={22} className="quote-icon" />
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <span className="avatar" style={{ background: t.color }}>{initials(t.name)}</span>
                <span><strong>{t.name}</strong><small>{t.role}</small></span>
                <button className="play-btn" aria-label={`Play story from ${t.name}`}><Play size={14} /></button>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
