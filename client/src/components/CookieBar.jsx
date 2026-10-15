import { useEffect, useState } from 'react';

const KEY = 'adg_cookie_consent';
const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v) => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } };

// Slides up after the intro; remembers the choice in this browser.
export default function CookieBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (read()) return;
    const t = setTimeout(() => setShow(true), 3200);
    return () => clearTimeout(t);
  }, []);

  const choose = (v) => { write(v); setShow(false); };

  return (
    <div className={`cookie ${show ? 'show' : ''}`} role="dialog" aria-live="polite" aria-label="Cookie consent" aria-hidden={!show}>
      <p>We use cookies to give you a smoother, faster experience on this site.</p>
      <div className="cookie-actions">
        <button className="cookie-decline" onClick={() => choose('declined')} tabIndex={show ? 0 : -1}>Decline</button>
        <button className="cookie-accept" onClick={() => choose('accepted')} tabIndex={show ? 0 : -1}>Accept</button>
      </div>
    </div>
  );
}
