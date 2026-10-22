import { useEffect, useRef, useState } from 'react';
import { Play, Instagram, ArrowUpRight } from 'lucide-react';
import { showcase } from '../data/site.js';

// Instagram reel/post links play in Instagram's embed; anything else is treated as an MP4.
function reelOf(url) {
  const m = String(url || '').match(/instagram\.com\/(?:[\w.]+\/)?(reels?|p|tv)\/([\w-]+)/i);
  if (!m) return null;
  const link = `https://www.instagram.com/${/^reel/i.test(m[1]) ? 'reel' : m[1].toLowerCase()}/${m[2]}/`;
  return { link, embed: `${link}embed/` };
}

// Video block that scales up as it scrolls into view, then plays inline.
export default function Showcase() {
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const reel = reelOf(showcase.video);

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
    if (!reel) requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  }

  return (
    <section className="section showcase">
      <div className="container">
        <div className="section-head" data-reveal>
          <h2>{showcase.heading[0]}<br /><span className="u-draw">{showcase.heading[1]}</span></h2>
        </div>
        <div className={`showcase-frame ${playing ? 'is-playing' : ''} ${reel ? 'is-reel' : ''}`} ref={frameRef}>
          {reel ? (
            <>
              <img className="showcase-poster" src={showcase.poster} alt="AD Graphic's 2.0 students in the studio" loading="lazy" decoding="async" />
              {playing && (
                <div className="showcase-reel">
                  <iframe
                    src={reel.embed} title="AD Graphic's 2.0 studio tour"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write" allowFullScreen
                  />
                  <a className="showcase-ig" href={reel.link} target="_blank" rel="noopener noreferrer">
                    <Instagram size={16} /> Open on Instagram <ArrowUpRight size={15} />
                  </a>
                </div>
              )}
            </>
          ) : (
            <video
              ref={videoRef}
              src={showcase.video}
              poster={showcase.poster}
              controls={playing}
              playsInline
              preload="metadata"
            />
          )}
          {!playing && (
            <button className="showcase-play" onClick={play} aria-label="Play studio tour video">
              <span className="ring" /><span className="ring ring--2" />
              <Play size={38} fill="currentColor" />
            </button>
          )}
          {!playing && (
            <span className="showcase-tag">
              {reel ? <><Instagram size={15} /> Watch the studio tour · Reel</> : 'Watch the studio tour · 2 min'}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
