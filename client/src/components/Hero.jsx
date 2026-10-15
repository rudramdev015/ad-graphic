import { ArrowRight, BadgeCheck, MapPin, BriefcaseBusiness, ChevronDown } from 'lucide-react';
import { brand } from '../data/site.js';

const badges = [
  { icon: BadgeCheck, text: `Limited: Only ${brand.seats} Seats` },
  { icon: MapPin, text: `Offline: ${brand.durationMonths} Months in ${brand.city}` },
  { icon: BriefcaseBusiness, text: 'Placement Support' },
];

export default function Hero({ onApply }) {
  return (
    <section className="hero" id="top">
      <div className="hero-media" aria-hidden="true">
        <img src="/hero.jpg" alt="" />
      </div>
      <div className="hero-shade" aria-hidden="true" />

      <div className="container hero-content">
        <h1 className="hero-title">
          <span className="line"><span>Learn Design &amp; Editing</span></span>
          <span className="line">
            <span>
              Inside a <em className="swash">Real Studio<svg viewBox="0 0 300 14" preserveAspectRatio="none"><path d="M2 9 C 80 2, 180 2, 298 7" /></svg></em>
            </span>
          </span>
        </h1>

        <ul className="hero-badges">
          {badges.map(({ icon: Icon, text }, i) => (
            <li key={text} style={{ '--i': i }}>
              <span className="badge-ico"><Icon size={16} /></span>
              {text}
            </li>
          ))}
        </ul>

        <div className="hero-ctas">
          <button className="btn btn-primary btn-lg btn-glow" onClick={onApply}>
            Pre-Register for {brand.batch} <ArrowRight size={18} />
          </button>
          <a href="#results" className="btn btn-glass btn-lg">View Student Results</a>
        </div>

        <p className="hero-note">{brand.batch} pre-registrations now open · Graphic Design + Video Editing</p>
      </div>

      <a href="#results" className="scroll-cue" aria-label="Scroll down"><ChevronDown size={22} /></a>
    </section>
  );
}
