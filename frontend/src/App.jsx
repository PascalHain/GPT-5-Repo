import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import GamesPage from './pages/GamesPage.jsx';
import ScoreboardPage from './pages/ScoreboardPage.jsx';
import GroupOverviewPage from './pages/GroupOverviewPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import KickbasePage from './pages/KickbasePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import KicktippPage from './pages/KicktippPage.jsx';

const BrandLink = () => {
  const location = useLocation();
  const isHome = location.pathname === '/dashboard' || location.pathname === '/';
  return (
    <Link className={isHome ? 'brand brand-active' : 'brand'} to="/dashboard">
      KickArena 2026
    </Link>
  );
};

function App() {
  return (
    <div>
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <BrandLink />
            <span className="home-hint">Zurück zum Dashboard</span>
          </div>
          <div className="header-right">
            <p className="eyebrow">Nordamerika</p>
            <p className="eyebrow">WM 2026</p>
          </div>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/kicktipp" element={<KicktippPage />} />
          <Route path="/kicktipp/groups" element={<KicktippPage initialTab="groups" />} />
          <Route path="/kicktipp/info" element={<KicktippPage initialTab="info" />} />
          <Route path="/kicktipp/tipps" element={<KicktippPage initialTab="tipps" />} />
          <Route path="/kicktipp/bracket" element={<KicktippPage initialTab="bracket" />} />
          <Route path="/kicktipp/calendar" element={<KicktippPage initialTab="calendar" />} />
          <Route path="/kickbase" element={<KickbasePage />} />
          <Route path="/teams/:code" element={<TeamPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
