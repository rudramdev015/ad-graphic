import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { showcase } from '../data/site.js';

// Video block that scales up as it scrolls into view, then plays inline.
export default function Showcase() {
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));
      el.style.setProperty('--p', p.toFixed(3));
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

  function play() {
    setPlaying(true);
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  }

  return (
    <section className="section showcase">
      <div className="container">
        <div className="section-head" data-reveal>
          <h2>{showcase.heading[0]}<br /><span className="u-draw">{showcase.heading[1]}</span></h2>
        </div>
        <div className={`showcase-frame ${playing ? 'is-playing' : ''}`} ref={frameRef}>
          <video
            ref={videoRef}
            src={showcase.video}
            poster={showcase.poster}
            controls={playing}
            playsInline
            preload="metadata"
          />
          {!playing && (
            <button className="showcase-play" onClick={play} aria-label="Play video">
              <span className="ring" /><span className="ring ring--2" />
              <Play size={38} fill="currentColor" />
            </button>
          )}
          {!playing && <span className="showcase-tag">Watch the studio tour · 2 min</span>}
        </div>
      </div>
    </section>
  );
}
