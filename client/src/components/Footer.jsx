import { ArrowRight, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { brand, nav } from '../data/site.js';
import Logo from './Logo.jsx';

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" />
  </svg>
);

export default function Footer({ onApply }) {
  const contacts = [
    { icon: <Instagram size={18} />, label: 'Instagram', href: brand.instagram },
    brand.email && { icon: <Mail size={18} />, label: brand.email, href: `mailto:${brand.email}` },
    { icon: <WhatsAppIcon />, label: brand.phone, href: brand.whatsapp },
    { icon: <MapPin size={18} />, label: brand.addressShort, href: brand.mapsUrl },
  ].filter(Boolean);

  return (
    <footer className="ft">
      <div className="container">
        {/* ---------- CTA banner ---------- */}
        <div className="ft-cta" data-reveal>
          <div className="ft-rings" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => <i key={i} style={{ '--r': i }} />)}
          </div>
          <div className="ft-cta-copy">
            <h2>Seats Are Filling Fast</h2>
            <p>Start your creative career today.</p>
          </div>
          <button className="ft-cta-btn" onClick={onApply}>
            Pre-Register for {brand.batch} <ArrowRight size={22} />
          </button>
        </div>
      </div>

      <div className="ft-main">
        <div className="container ft-center" data-reveal>
          <a href="#top" className="ft-logo" aria-label={brand.name}><Logo /></a>
          <p className="ft-about">{brand.about}</p>

          <ul className="ft-pills">
            {contacts.map((c, i) => (
              <li key={c.label} style={{ '--i': i }}>
                <a href={c.href} target="_blank" rel="noreferrer">{c.icon}<span>{c.label}</span></a>
              </li>
            ))}
          </ul>

          <address className="ft-address">
            <MapPin size={15} /> {brand.address}
          </address>
          <a className="ft-call" href={brand.phoneHref}><Phone size={15} /> Call us: {brand.phone}</a>

          <nav className="ft-nav">
            {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
        </div>
        <div className="container ft-bottom">
          <span>© {new Date().getFullYear()} {brand.name}. All rights reserved.</span>
          <span>{brand.tagline}</span>
        </div>
      </div>

      <a className="ft-wa-float" href={brand.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <WhatsAppIcon width="28" height="28" />
      </a>
    </footer>
  );
}
