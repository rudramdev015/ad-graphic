import { useState } from 'react';
import { brand } from '../data/site.js';

// The "AD" mark, drawn in SVG so it stays sharp at any size.
export function Mark({ size = 40, ink = '#0a0a0a', cut = '#ffffff', bg = '#FFC800' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {bg && <rect width="100" height="100" rx="22" fill={bg} />}
      <g transform="translate(12 14) scale(.76)">
        {/* A */}
        <polygon points="0,96 36,4 54,4 54,96 41,96 38,86 22,86 18,96" fill={ink} />
        <polygon points="26,72 39,38 41,72" fill={cut} />
        {/* D */}
        <path d="M60 4 H68 C92 4 100 28 100 50 C100 72 92 96 68 96 H60 L60 80 C78 80 84 66 84 50 C84 34 78 20 64 20 Z" fill={ink} />
      </g>
    </svg>
  );
}

export default function Logo({ variant = 'dark' }) {
  // Drop your logo at client/public/logo.png and it will be used automatically.
  const [hasImage, setHasImage] = useState(true);

  return (
    <span className={`logo logo--${variant}`}>
      {hasImage ? (
        <img src="/logo.png" alt="" width="42" height="42" className="logo-img" onError={() => setHasImage(false)} />
      ) : (
        <Mark size={42} />
      )}
      <span className="logo-text">
        <span className="logo-name">GR<span className="logo-a">A</span>PHIC’S <b>{brand.version}</b></span>
        <small>Design · Video</small>
      </span>
    </span>
  );
}
