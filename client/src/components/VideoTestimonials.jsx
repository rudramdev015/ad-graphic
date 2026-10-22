import { useCallback, useEffect, useRef, useState } from 'react';
import './videoTestimonials.css';
import { brand, labels, sections, fill } from '../data/site.js';

// Shown until the API responds (or if it is unreachable).
const FALLBACK = [
  { id: 'f1', name: 'Student 01', role: 'Graphic Design Student', quote: 'Learning design and editing side by side, inside a real studio.', poster: '/students/st01.jpg', video: '/studio.mp4' },
  { id: 'f2', name: 'Student 02', role: 'Video Editing Student', quote: 'Every week brings a new brief and honest feedback from mentors.', poster: '/students/st02.jpg', video: '/studio.mp4' },
  { id: 'f3', name: 'Student 03', role: 'Design + Video Student', quote: 'Daily practice on pro software, with mentors right beside you.', poster: '/students/st03.jpg', video: '/studio.mp4' },
  { id: 'f4', name: 'Student 04', role: 'Motion Graphics Student', quote: 'From the basics of layout to full edits — one step at a time.', poster: '/students/st04.jpg', video: '/studio.mp4' },
];

const hue = (s) => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);

function parseVideo(url) {
  const u = String(url || '').trim();
  const yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i);
  if (yt) return { kind: 'youtube', id: yt[1], vertical: /\/shorts\//i.test(u) };
  return { kind: 'file', src: u, vertical: false };
}

/* ---------------- icons ---------------- */
const PlayIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z" /></svg>;
const MicIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5" /></svg>;
const CamIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m16 10 6-4v12l-6-4z" /></svg>;
const MeetIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2.5l5-3.5v12l-5-3.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
const Chevron = ({ dir }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} /></svg>;

/* ---------------- card ---------------- */
function Card({ t, i, onPlay }) {
  const h = hue(t.name);
  const [broken, setBroken] = useState(false);
  const showPoster = t.poster && !broken;
  const play = () => onPlay(t);

  return (
    <article className="vt-card" style={{ '--i': i }} aria-roledescription="slide">
      <div className="vt-window">
        <div className="vt-titlebar" aria-hidden="true"><i /><i /><i /></div>
        <div
          className="vt-thumb" role="button" tabIndex={0}
          aria-label={`Play video testimonial from ${t.name}`}
          onClick={play}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } }}
        >
          {showPoster ? (
            <img src={t.poster} alt={`${t.name}, ${t.role}`} loading="lazy" draggable="false" onError={() => setBroken(true)} />
          ) : (
            <div className="vt-fallback" role="img" aria-label={t.name}
              style={{ background: `linear-gradient(135deg, hsl(${h} 70% 42%), hsl(${(h + 50) % 360} 75% 22%))` }}>
              {t.name.trim()[0] || '?'}
            </div>
          )}
          <span className="vt-play" aria-hidden="true"><PlayIcon /></span>
          <div className="vt-lower" aria-hidden="true">
            <div className="vt-name"><b>{t.name}</b><span className="vt-logo">AD</span></div>
            <div className="vt-role">{t.role}</div>
          </div>
        </div>
        <div className="vt-controls" aria-hidden="true"><MicIcon /><CamIcon /><span className="vt-rec" /></div>
      </div>
      <p className="vt-quote">“{t.quote}”</p>
      <div className="vt-apps" aria-hidden="true">
        <span className="vt-app vt-app--meet"><MeetIcon /></span>
        <span className="vt-app vt-app--ae">Ae</span>
        <span className="vt-app vt-app--ps">Ps</span>
        <span className="vt-app vt-app--pr">Pr</span>
      </div>
    </article>
  );
}

/* ---------------- modal ---------------- */
function VideoModal({ item, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!item) return;
    const prev = document.activeElement;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [item, onClose]);

  if (!item) return null;
  const v = parseVideo(item.video);

  return (
    <div className="vt-modal open" role="dialog" aria-modal="true" aria-label={`${item.name} video testimonial`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <button ref={closeRef} className="vt-close" type="button" aria-label="Close video" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
      <div className={`vt-stage ${v.vertical ? 'vertical' : ''}`}>
        {v.kind === 'youtube' ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
            title={`${item.name} testimonial`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
          />
        ) : (
          <video src={v.src} poster={item.poster || undefined} controls autoPlay playsInline aria-label={`${item.name} testimonial`} />
        )}
      </div>
    </div>
  );
}

/* ---------------- section ---------------- */
export default function VideoTestimonials({ onApply }) {
  const [items, setItems] = useState(FALLBACK);
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [per, setPer] = useState(4);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(null);
  const [dragging, setDragging] = useState(false);

  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const hover = useRef(false);
  const drag = useRef({ on: false, moved: false, x: 0, y: 0, dx: 0, id: null });
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // load from backend
  useEffect(() => {
    let alive = true;
    fetch('/api/testimonials')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d?.testimonials?.length) setItems(d.testimonials); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // cards per view follows the CSS variable set by media queries
  useEffect(() => {
    const read = () => {
      if (!rootRef.current) return;
      setPer(parseFloat(getComputedStyle(rootRef.current).getPropertyValue('--per')) || 1);
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);

  // reveal
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (reduce || !('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const maxIndex = Math.max(0, items.length - Math.floor(per));
  const go = useCallback((i) => setIndex(i > maxIndex ? 0 : i < 0 ? maxIndex : i), [maxIndex]);
  useEffect(() => { if (index > maxIndex) setIndex(maxIndex); }, [index, maxIndex]);

  // autoplay (pauses on hover, while modal is open, or when tab hidden)
  const [tick, setTick] = useState(0);
  const restart = () => setTick((t) => t + 1);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (!hover.current && !active && !document.hidden && !drag.current.on) go(index + 1);
    }, 4500);
    return () => clearInterval(id);
  }, [index, go, active, reduce, tick]);

  const step = () => {
    const card = trackRef.current?.children[0];
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(trackRef.current).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  /* drag / swipe */
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    drag.current = { on: true, moved: false, x: e.clientX, y: e.clientY, dx: 0, id: e.pointerId };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.on || e.pointerId !== d.id) return;
    d.dx = e.clientX - d.x;
    if (!d.moved && Math.abs(d.dx) > 6 && Math.abs(d.dx) > Math.abs(e.clientY - d.y)) {
      d.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(d.id);
    }
    if (d.moved) {
      const edge = (index === 0 && d.dx > 0) || (index === maxIndex && d.dx < 0);
      setOffset(edge ? d.dx * 0.35 : d.dx);
    }
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    setDragging(false);
    setOffset(0);
    if (!d.moved) return;
    const s = step() || 1;
    const threshold = Math.min(90, s * 0.18);
    const n = Math.max(1, Math.round(Math.abs(d.dx) / s));
    if (d.dx < -threshold) setIndex(Math.min(index + n, maxIndex));
    else if (d.dx > threshold) setIndex(Math.max(index - n, 0));
    restart();
  };
  const swallowClick = (e) => {
    if (drag.current.moved) { e.stopPropagation(); e.preventDefault(); drag.current.moved = false; }
  };

  const translate = -index * step() + offset;
  const closeModal = useCallback(() => setActive(null), []);

  return (
    <section ref={rootRef} className={`vt ${inView ? 'in' : ''}`} id="testimonials" aria-labelledby="vt-title">
      <div className="vt-wrap">
        <header className="vt-head">
          <span className="vt-pill">{fill(sections.testimonials.pill)}</span>
          <h2 className="vt-title" id="vt-title">{fill(sections.testimonials.title)} <span className="vt-hl">{fill(sections.testimonials.highlight)}</span> {fill(sections.testimonials.after)}</h2>
        </header>

        <div
          className="vt-carousel" role="region" aria-roledescription="carousel" aria-label="Student video testimonials"
          onMouseEnter={() => { hover.current = true; }} onMouseLeave={() => { hover.current = false; }}
          onKeyDown={(e) => {
            if (e.target.closest('.vt-thumb')) return;
            if (e.key === 'ArrowRight') { go(index + 1); restart(); }
            if (e.key === 'ArrowLeft') { go(index - 1); restart(); }
          }}
        >
          <button className="vt-arrow vt-prev" type="button" aria-label="Previous testimonials" onClick={() => { go(index - 1); restart(); }}><Chevron dir="left" /></button>
          <div
            className={`vt-viewport ${dragging ? 'dragging' : ''}`}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove}
            onPointerUp={endDrag} onPointerCancel={endDrag} onClickCapture={swallowClick}
          >
            <div className="vt-track" ref={trackRef} style={{ transform: `translate3d(${translate}px,0,0)` }}>
              {items.map((t, i) => <Card key={t.id || i} t={t} i={i} onPlay={setActive} />)}
            </div>
          </div>
          <button className="vt-arrow vt-next" type="button" aria-label="Next testimonials" onClick={() => { go(index + 1); restart(); }}><Chevron dir="right" /></button>
        </div>

        <div className="vt-dots" role="tablist" aria-label="Choose slide">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button key={i} type="button" role="tab" className="vt-dot" aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? 'true' : 'false'} onClick={() => { setIndex(i); restart(); }} />
          ))}
        </div>

        <div className="vt-cta-row">
          <button type="button" className="vt-cta" onClick={onApply}>{labels().cta} <span aria-hidden="true">→</span></button>
        </div>
      </div>

      <VideoModal item={active} onClose={closeModal} />
    </section>
  );
}
