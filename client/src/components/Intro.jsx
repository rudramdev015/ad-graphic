import { useEffect, useState } from 'react';
import { Mark } from './Logo.jsx';
import { brand } from '../data/site.js';

// Brand intro loader + scroll progress bar.
export function Preloader() {
  const [state, setState] = useState('show'); // show -> leave -> gone
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t1 = setTimeout(() => setState('leave'), reduce ? 0 : 1300);
    const t2 = setTimeout(() => setState('gone'), reduce ? 0 : 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (state === 'gone') return null;
  return (
    <div className={`intro intro--${state}`} aria-hidden="true">
      <div className="intro-inner">
        <span className="intro-mark"><Mark size={92} /></span>
        <span className="intro-name">{brand.name}</span>
        <span className="intro-bar"><i /></span>
      </div>
    </div>
  );
}

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div className="scroll-progress" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />;
}
