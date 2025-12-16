import { Link } from 'react-router-dom';

function DashboardCard({ title, subtitle, to, description, badge }) {
  return (
    <Link to={to} className="dash-card">
      <div className="dash-card-top">
        <div>
          <p className="eyebrow">{badge}</p>
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
        </div>
        <div className="cta-pill">Los geht's →</div>
      </div>
      <p className="muted">{description}</p>
    </Link>
  );
}

function DashboardPage() {
  const newsItems = [
    {
      title: 'Azteca-Upgrade fast fertig',
      subtitle: 'Mexiko-Stadt installiert neues Dach & Hospitality für die WM.',
      image:
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      tag: 'Stadien',
    },
    {
      title: 'SoFi Stadium feintuned für Soccer',
      subtitle: 'Los Angeles passt Spielfeld und LED-Bänder für die Gruppenphase an.',
      image:
        'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80',
      tag: 'USA',
    },
    {
      title: 'Fanwalk Vancouver',
      subtitle: 'BC Place plant Waterfront-Fanzonen mit Live-Bühnen und Streetfood.',
      image:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      tag: 'Kanada',
    },
  ];

  return (
    <div className="stack-xl">
      <div className="hero">
        <div>
          <p className="eyebrow">Central Hub</p>
          <h1>Dein WM 2026 Dashboard</h1>
          <p className="muted">
            Wähle Kicktipp für Gruppen, Infos und Tipps oder springe in den Kickbase-Simulator
            mit Aufstellung, News und Transfermarkt.
          </p>
        </div>
      </div>
      <div className="dash-grid">
        <DashboardCard
          title="Kicktipp"
          subtitle="Gruppen, Spielinfos & Tipps"
          badge="Tipprunde"
          to="/kicktipp"
          description="Alle Gruppen, Spielpläne und Tippabgabe in einem klaren Flow."
        />
        <DashboardCard
          title="Kickbase WM"
          subtitle="Aufstellung, News & Transfers"
          badge="Simulator"
          to="/kickbase"
          description="Besten Teams scouten, 4-3-3 aufstellen und Live-Punkte verfolgen."
        />
      </div>

      <div className="stack-md">
        <div className="mode-header">
          <div>
            <p className="eyebrow">Stadion-Storys</p>
            <h2>News-Feed aus Nordamerika</h2>
            <p className="muted">Kuratiertes Update-Raster mit Bildern aus Mexiko, USA und Kanada.</p>
          </div>
        </div>
        <div className="news-grid">
          {newsItems.map((item) => (
            <div key={item.title} className="news-card">
              <img src={item.image} alt={item.title} className="news-image" />
              <div className="news-body">
                <div className="news-meta">
                  <span className="news-badge">{item.tag}</span>
                  <span>WM 2026</span>
                </div>
                <h3>{item.title}</h3>
                <p className="muted">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
