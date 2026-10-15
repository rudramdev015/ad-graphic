import { MonitorPlay, School } from 'lucide-react';
import { brand, comparison } from '../data/site.js';
import { Mark } from './Logo.jsx';

// Rows = options, columns = criteria. Our academy is highlighted on top.
export default function Comparison() {
  const criteria = comparison.rows.map((r) => r.label);
  const valuesFor = (col) => comparison.rows.map((r) => r.values[col]);

  const options = [
    { key: 'us', name: brand.short, sub: 'Academy', icon: <Mark size={40} />, values: valuesFor(2), us: true },
    { key: 'online', name: 'Online', sub: 'Courses', icon: <MonitorPlay size={24} />, values: valuesFor(0) },
    { key: 'offline', name: 'Offline', sub: 'Institutes', icon: <School size={24} />, values: valuesFor(1) },
  ];

  return (
    <section className="section cmp-sec" id="compare">
      <div className="cmp-grid-bg" aria-hidden="true" />
      <div className="container">
        <div className="section-head" data-reveal>
          <h2>Compare Your <span className="u-draw">Options</span></h2>
          <p>See why students choose a studio over a screen or a classroom.</p>
        </div>

        <div className="cmp-scroll" data-reveal>
          <div className="cmp" role="table" aria-label="Comparison of learning options" style={{ '--cols': criteria.length }}>
            <div className="cmp-head" role="row">
              <span className="cmp-corner" role="columnheader" aria-label="Option" />
              {criteria.map((c, i) => (
                <span key={c} className="cmp-tab" role="columnheader" style={{ '--i': i }}>{c}</span>
              ))}
            </div>

            {options.map((o, r) => (
              <div key={o.key} className={`cmp-row ${o.us ? 'cmp-row--us' : ''}`} role="row" style={{ '--r': r }}>
                <div className="cmp-name" role="rowheader">
                  <span className="cmp-ico">{o.icon}</span>
                  <strong>{o.name}<br />{o.sub}</strong>
                </div>
                {o.values.map((v, i) => (
                  <span key={i} className="cmp-cell" role="cell" data-label={criteria[i]}>{v}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="cmp-hint">← Swipe to compare →</p>
      </div>
    </section>
  );
}
