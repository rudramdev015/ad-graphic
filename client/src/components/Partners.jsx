import { ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
import { partners } from '../data/site.js';

export default function Partners() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Hiring network</span>
          <h2>Get in front of <span className="serif-accent">the people hiring.</span></h2>
        </div>
        <div className="partners" data-reveal>
          {partners.map((p) => <div className="partner" key={p}>{p}</div>)}
        </div>
        <div className="partner-perks">
          <div className="card perk" data-reveal>
            <ShieldCheck size={26} />
            <div><h4>Placement support</h4><p>Interviews and referrals until you land paid work.</p></div>
          </div>
          <div className="card perk" data-reveal>
            <InfinityIcon size={26} />
            <div><h4>Lifetime alumni access</h4><p>Job leads and community support long after graduation.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
