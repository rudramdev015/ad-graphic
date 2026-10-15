const items = ['GRAPHIC DESIGN', 'VIDEO EDITING', 'MOTION GRAPHICS', 'BRANDING', 'COLOUR GRADING', 'SOCIAL CREATIVES'];

export default function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((k) => (
          <span key={k}>
            {items.map((t) => <span key={t}>{t} <b>✦</b> </span>)}
          </span>
        ))}
      </div>
    </div>
  );
}
