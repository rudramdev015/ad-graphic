import { MonitorPlay, UserRoundCheck, Cpu, IndianRupee } from 'lucide-react';
import { pillars } from '../data/site.js';

// Duotone line icons: black stroke with a crimson accent badge.
const icons = [MonitorPlay, UserRoundCheck, Cpu, IndianRupee];
const tilts = [-4, 0, -2.5, 0];
const tones = ['mint', 'lav', 'blush', 'lilac'];

export default function Pillars() {
  return (
    <section className="section pillars-sec">
      <div className="container">
        <div className="section-head" data-reveal>
          <h2>Not Just Another <span className="u-draw">‘Course’</span></h2>
          <p>Built for people who want careers, not certificates.</p>
        </div>
        <div className="pillars">
          {pillars.map((p, i) => {
            const Icon = icons[i];
            return (
              <article
                key={p.title}
                className={`pcard pcard--${tones[i]}`}
                data-reveal
                style={{ '--tilt': `${tilts[i]}deg`, '--d': `${i * 120}ms` }}
              >
                <h3>{p.title}</h3>
                <span className="pcard-icon">
                  <Icon size={54} strokeWidth={1.4} />
                  <i />
                </span>
                <p>{p.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
