import { comparison } from '../data/site.js';

export default function Comparison() {
  const last = comparison.columns.length - 1;
  return (
    <section className="section section--panel" id="compare">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Compare</span>
          <h2>How we stack up <span className="serif-accent">against the rest.</span></h2>
        </div>
        <div className="compare-wrap" data-reveal>
          <table className="compare">
            <thead>
              <tr>
                <th />
                {comparison.columns.map((c, i) => (
                  <th key={c} className={i === last ? 'is-us' : ''}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  {r.values.map((v, i) => (
                    <td key={i} className={i === last ? 'is-us' : ''}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
