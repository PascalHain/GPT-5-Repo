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
    </div>
  );
}

export default DashboardPage;
