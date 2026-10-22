import { sections, fill } from '../data/site.js';

// Shared, admin-editable section heading: eyebrow · title + highlight + after · sub.
export default function SectionHead({ k, accent = 'u-draw', className = '', children }) {
  const s = sections[k] || {};
  return (
    <div className={`section-head ${className}`} data-reveal>
      {s.eyebrow && <span className="eyebrow">{fill(s.eyebrow)}</span>}
      <h2>
        {fill(s.title)} <span className={accent}>{fill(s.highlight)}</span>
        {s.after ? ` ${fill(s.after)}` : ''}
      </h2>
      {s.sub && <p>{fill(s.sub)}</p>}
      {children}
    </div>
  );
}
