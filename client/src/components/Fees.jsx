import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Info, Award } from 'lucide-react';
import { brand, fees, labels } from '../data/site.js';
import SectionHead from './SectionHead.jsx';

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

// Counts a rupee amount up from 0 once it scrolls into view.
function Price({ amount }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(amount); return; }
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 1400, 1);
        setN(Math.round(amount * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [amount]);
  return <span ref={ref} className="fee-price" aria-label={inr(amount)}>{inr(n)}</span>;
}

function Step({ num, title, sub, children, delay }) {
  return (
    <article className="fee-card" data-reveal style={{ '--d': `${delay}ms` }}>
      <header className="fee-head">
        <span className="fee-num">{num}</span>
        <div>
          <h3>{title}</h3>
          <p>{sub}</p>
        </div>
      </header>
      <div className="fee-rule" />
      {children}
    </article>
  );
}

const Tick = () => <span className="fee-tick"><Check size={14} strokeWidth={3.2} /></span>;

export default function Fees({ onApply }) {
  return (
    <section className="section fees-sec" id="fees">
      <div className="container">
        <SectionHead k="fees" />

        <div className="fee-grid">
          <Step num="01" title="Submit Your Application" sub="Takes about two minutes to fill." delay={0}>
            <p className="fee-label">Application Fee:</p>
            <div className="fee-price-row"><Price amount={fees.applicationFeeAmount} /></div>
            <ul className="fee-list">
              <li><Tick /> Selected? It’s adjusted against your program fee.</li>
              <li><Tick /> Not selected? You get a full refund.</li>
            </ul>
            <div className="fee-foot">
              <p className="fee-note"><Info size={15} /> {brand.batch} {labels().noun} are open now</p>
              <button className="fee-btn" onClick={onApply}>
                <span>{labels().cta}</span> <ArrowRight size={20} />
              </button>
            </div>
          </Step>

          <Step num="02" title="Secure Your Seat" sub="Opens after your selection interview." delay={140}>
            <p className="fee-label">Full Program Fee:</p>
            <div className="fee-price-row">
              <Price amount={fees.programFeeAmount} />
              <span className="fee-emi">{fees.emiText}</span>
            </div>
            <ul className="fee-list">
              {fees.includes.slice(0, 5).map((t) => <li key={t}><Tick /> {t}</li>)}
            </ul>
            <div className="fee-foot">
              <p className="fee-note"><Info size={15} /> One transparent fee — no surprise charges later.</p>
            </div>
          </Step>
        </div>

        <div className="fee-scholar" data-reveal>
          <span className="fee-scholar-ico"><Award size={26} /></span>
          <div>
            <h4>{fees.scholarship.title}</h4>
            <p>{fees.scholarship.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
