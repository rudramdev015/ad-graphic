import { useEffect, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { brand, nav } from '../data/site.js';
import Logo from './Logo.jsx';

export default function Navbar({ onApply }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav-pill">
        <a href="#top" className="nav-logo" aria-label={brand.name}><Logo /></a>
        <nav className="nav-links">
          {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <button className="btn btn-primary nav-cta" onClick={onApply}>
          Pre-Register for {brand.batch} <ArrowRight size={16} />
        </button>
        <button className="nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className="nav-mobile">
        {nav.map((n) => <a key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>)}
        <button className="btn btn-primary" onClick={() => { setOpen(false); onApply(); }}>
          Pre-Register for {brand.batch}
        </button>
      </div>
    </header>
  );
}
