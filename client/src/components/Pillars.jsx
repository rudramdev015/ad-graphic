import { MonitorPlay, UserRoundCheck, Cpu, IndianRupee } from 'lucide-react';
import { pillars } from '../data/site.js';
import SectionHead from './SectionHead.jsx';

// Duotone line icons: black stroke with a crimson accent badge.
const icons = [MonitorPlay, UserRoundCheck, Cpu, IndianRupee];
const tilts = [-4, 0, -2.5, 0];
const tones = ['mint', 'lav', 'blush', 'lilac'];

export default function Pillars() {
  return (
    <section className="section pillars-sec">
      <div className="container">
        <SectionHead k="pillars" />
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
