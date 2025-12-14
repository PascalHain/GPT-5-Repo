import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:4000';

function TournamentPage() {
  const [groups, setGroups] = useState([]);
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState('');

  const fetchGroups = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/groups`);
      const data = await res.json();
      setGroups(data);
    } catch (error) {
      setStatus('Konnte Gruppen nicht laden.');
    }
  };

  const fetchGames = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/games`);
      const data = await res.json();
      setGames(data);
    } catch (error) {
      setStatus('Konnte Spiele nicht laden.');
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchGames();
  }, []);

  const gamesByGroup = useMemo(() => {
    return games.reduce((acc, game) => {
      const key = game.group || 'Weitere Spiele';
      acc[key] = acc[key] || [];
      acc[key].push(game);
      return acc;
    }, {});
  }, [games]);

  return (
    <div>
      <h1 className="section-title">Turnier-Übersicht</h1>
      <p>Alle Gruppen der WM inklusive Stadien, Trainerinfos und Spielplan.</p>

      <div className="grid">
        {groups.map((group) => (
          <div className="card" key={group.name}>
            <div className="card-header">
              <div>
                <h2>{group.name}</h2>
                <p className="muted">Austragungsorte: {group.city}</p>
              </div>
              <span className="badge">4 Teams</span>
            </div>
            <ul className="list">
              {group.teams.map((team) => (
                <li key={team.name}>
                  <div className="list-title">{team.name}</div>
                  <div className="muted">Trainer: {team.coach}</div>
                  <div className="muted">FIFA-Ranking: {team.fifaRank}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <section style={{ marginTop: '28px' }}>
        <div className="section-header">
          <h2>Spielplan nach Gruppen</h2>
          <button className="button" onClick={() => { fetchGroups(); fetchGames(); }}>
            Aktualisieren
          </button>
        </div>
        {Object.entries(gamesByGroup).map(([groupName, groupGames]) => (
          <div className="card" key={groupName}>
            <div className="card-header">
              <h3>{groupName}</h3>
              <span className="badge secondary">Gruppenphase</span>
            </div>
            <ul className="list">
              {groupGames.map((game) => (
                <li key={game.id} className="list-game">
                  <div className="list-title">
                    {game.teamA} vs. {game.teamB}
                  </div>
                  <div className="muted">
                    {new Date(game.date).toLocaleString()} · {game.stadium || 'noch offen'}
                  </div>
                  <div className="muted">Ergebnis: {game.scoreA ?? '-'} : {game.scoreB ?? '-'}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {status && <p>{status}</p>}
    </div>
  );
}

export default TournamentPage;
