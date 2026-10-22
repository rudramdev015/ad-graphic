import { ArrowRight, BadgeCheck, MapPin, BriefcaseBusiness, ChevronDown } from 'lucide-react';
import { hero, labels, fill } from '../data/site.js';

const badgeIcons = [BadgeCheck, MapPin, BriefcaseBusiness];

export default function Hero({ onApply }) {
  return (
    <section className="hero" id="top">
      <div className="hero-media" aria-hidden="true">
        <img
          src={hero.image} alt="" fetchpriority="high" decoding="async"
          {...(hero.image === '/hero.jpg' && { srcSet: '/hero-1280.jpg 1280w, /hero.jpg 2400w', sizes: '100vw' })}
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />

      <div className="container hero-content">
        <h1 className="hero-title">
          <span className="line"><span>{fill(hero.line1)}</span></span>
          <span className="line">
            <span>
              {fill(hero.line2Before)}{' '}
              <em className="swash">{fill(hero.highlight)}<svg viewBox="0 0 300 14" preserveAspectRatio="none"><path d="M2 9 C 80 2, 180 2, 298 7" /></svg></em>
            </span>
          </span>
        </h1>

        <ul className="hero-badges">
          {hero.badges.filter(Boolean).map((text, i) => {
            const Icon = badgeIcons[i % badgeIcons.length];
            return (
              <li key={text + i} style={{ '--i': i }}>
                <span className="badge-ico"><Icon size={16} /></span>
                {fill(text)}
              </li>
            );
          })}
        </ul>

        <div className="hero-ctas">
          <button className="btn btn-primary btn-lg btn-glow" onClick={onApply}>
            {labels().cta} <ArrowRight size={18} />
          </button>
          <a href="#results" className="btn btn-glass btn-lg">{fill(hero.secondaryCta)}</a>
        </div>

        <p className="hero-note">{fill(hero.note)}</p>
      </div>

      <a href="#results" className="scroll-cue" aria-label="Scroll down"><ChevronDown size={22} /></a>
    </section>
  );
}
