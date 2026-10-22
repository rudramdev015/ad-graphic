import { tools, skills } from '../data/site.js';
import SectionHead from './SectionHead.jsx';

export default function Toolkit() {
  return (
    <section className="section section--panel">
      <div className="container">
        <SectionHead k="toolkit" accent="serif-accent" />
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
