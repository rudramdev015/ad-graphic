import { useState } from 'react';
import { brand } from '../data/site.js';

// The "AD" mark, drawn in SVG — used only if the logo image fails to load.
function SvgMark({ size, ink = '#0a0a0a', cut = '#ffffff', bg = '#FFC800' }) {
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

// The official AD Graphic's 2.0 logo (client/public/logo.webp, or the one uploaded in Admin).
export function Mark({ size = 40, ...rest }) {
  const [ok, setOk] = useState(true);
  if (!ok) return <SvgMark size={size} {...rest} />;
  return (
    <img
      src={brand.logo || '/logo.webp'} alt="" aria-hidden="true" width={size} height={size}
      className="mark-img" style={{ width: size, height: size }} decoding="async" onError={() => setOk(false)}
    />
  );
}

export default function Logo({ variant = 'dark' }) {
  return (
    <span className={`logo logo--${variant}`}>
      <span className="logo-badge"><Mark size={46} /></span>
      <span className="logo-text">
        <span className="logo-name">GR<span className="logo-a">A</span>PHIC’S <b>{brand.version}</b></span>
        <small>Design · Video</small>
      </span>
    </span>
  );
}
