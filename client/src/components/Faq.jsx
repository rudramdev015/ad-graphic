import { useState } from 'react';
import { Plus } from 'lucide-react';
import { faqs, brand, sections, fill } from '../data/site.js';

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section section--panel" id="faqs">
      <div className="container faq-wrap">
        <div className="faq-intro" data-reveal>
          <span className="eyebrow">{fill(sections.faq.eyebrow)}</span>
          <h2>{fill(sections.faq.title)} <span className="serif-accent">{fill(sections.faq.highlight)}</span></h2>
          <p>{fill(sections.faq.sub)}</p>
          <a className="btn btn-ghost" href={brand.whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq ${isOpen ? 'open' : ''}`} key={f.q} data-reveal>
                <button className="faq-q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span>{f.q}</span>
                  <Plus size={20} className="faq-icon" />
                </button>
                <div className="faq-a"><div><p>{f.a}</p></div></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
