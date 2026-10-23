import { tools, skills } from '../data/site.js';
import SectionHead from './SectionHead.jsx';

export default function Toolkit() {
  return (
    <section className="section section--panel">
      <div className="container">
        <SectionHead k="toolkit" accent="serif-accent" />
        <div className="tools">
          {tools.map((t) => (
            <div className={`tool ${t.ai ? 'tool--ai' : ''}`} key={t.name} data-reveal>
              {t.ai && <span className="tool-ai-tag">AI</span>}
              <span
                className={`tool-icon ${t.abbr.length > 2 ? 'tool-icon--sm' : ''}`}
                style={{ color: t.color, background: t.bg, borderColor: t.color, '--glow': t.color }}
              >{t.abbr}</span>
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
