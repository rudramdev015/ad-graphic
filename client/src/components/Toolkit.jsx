import { tools, skills } from '../data/site.js';

export default function Toolkit() {
  return (
    <section className="section section--panel">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Tools & skills</span>
          <h2>Master the <span className="serif-accent">industry toolkit.</span></h2>
          <p>The software studios use, plus the soft skills that get you rehired.</p>
        </div>
        <div className="tools">
          {tools.map((t) => (
            <div className="tool" key={t.name} data-reveal>
              <span className="tool-icon" style={{ color: t.color, background: t.bg, borderColor: t.color }}>{t.abbr}</span>
              <span>{t.name}</span>
            </div>
          ))}
        </div>
        <div className="skills" data-reveal>
          {skills.map((s) => <span className="skill" key={s}>{s}</span>)}
        </div>
      </div>
    </section>
  );
}
