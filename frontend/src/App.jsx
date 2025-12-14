import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import GamesPage from './pages/GamesPage.jsx';
import ScoreboardPage from './pages/ScoreboardPage.jsx';
import GroupOverviewPage from './pages/GroupOverviewPage.jsx';

import TeamPage from './pages/TeamPage.jsx';


const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  return (
    <Link className={isActive ? 'nav-link active' : 'nav-link'} to={to}>
      {children}
    </Link>
  );
};

function App() {
  return (
    <div>
      <header className="header">
        <div className="header-inner">
          <div>
            <p className="eyebrow">WM 2026</p>
            <h1 className="brand">KickTipp Next</h1>
          </div>
          <nav className="nav">
            <NavLink to="/groups">Gruppen</NavLink>
            <NavLink to="/games">Spiele & Tipps</NavLink>
            <NavLink to="/scoreboard">Rangliste</NavLink>
          </nav>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/groups" element={<GroupOverviewPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />

          <Route path="/teams/:code" element={<TeamPage />} />

          <Route path="*" element={<Navigate to="/groups" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
