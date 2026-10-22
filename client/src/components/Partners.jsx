import { ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';
import { partners } from '../data/site.js';
import SectionHead from './SectionHead.jsx';

export default function Partners() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead k="partners" accent="serif-accent" />
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
