import { Link, Navigate, Route, Routes } from 'react-router-dom';
import GamesPage from './pages/GamesPage.jsx';
import ScoreboardPage from './pages/ScoreboardPage.jsx';
import TournamentPage from './pages/TournamentPage.jsx';

function App() {
  return (
    <div>
      <header className="header">
        <nav className="nav">
          <Link to="/tournament">Turnier</Link>
          <Link to="/games">Spiele</Link>
          <Link to="/scoreboard">Rangliste</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/tournament" element={<TournamentPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
          <Route path="*" element={<Navigate to="/tournament" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
