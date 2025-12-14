import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_BASE = 'http://localhost:4000';

const formatDate = (dateString) => new Date(dateString).toLocaleString();

function TeamPage() {
  const { code } = useParams();
  const [team, setTeam] = useState(null);
  const [status, setStatus] = useState('');

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams/${encodeURIComponent(code)}`);
      if (!res.ok) {
        throw new Error('Team konnte nicht geladen werden.');
      }
      const data = await res.json();
      setTeam(data);
      setStatus('');
    } catch (error) {
      setStatus(error.message || 'Fehler beim Laden des Teams.');
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [code]);

  if (!team) {
    return (
      <div>
        <p className="eyebrow">Team</p>
        <h2 className="section-title">Lädt...</h2>
        {status && <p className="status error">{status}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">{team.groupId}</p>
          <h2 className="section-title">
            <span className="flag">{team.flag}</span> {team.name}
          </h2>
          <p className="muted">
            {team.confed} · FIFA-Ranking #{team.ranking} · {team.storyline}
          </p>
          <p className="muted">
            Gruppe {team.groupId}: {team.groupName}
          </p>
          <Link className="button ghost" to="/groups">
            Zurück zur Übersicht
          </Link>
        </div>
      </div>

      <section className="card">
        <header className="card-header">
          <div>
            <p className="eyebrow">Fakten</p>
            <h3 className="card-title">Matches & Form</h3>
          </div>
        </header>
        <div className="card-body">
          <div className="fixture-list">
            {team.fixtures.map((game) => (
              <article key={game.id} className="fixture">
                <div>
                  <p className="muted small">{game.venue}</p>
                  <p className="fixture-title">
                    <Link to={`/teams/${game.teamACode}`} className="inline-flag">
                      <span className="flag">{game.teamAFlag}</span> {game.teamA}
                    </Link>{' '}
                    vs.{` `}
                    <Link to={`/teams/${game.teamBCode}`} className="inline-flag">
                      <span className="flag">{game.teamBFlag}</span> {game.teamB}
                    </Link>
                  </p>
                  <p className="muted small">Anpfiff: {formatDate(game.kickoff)}</p>
                </div>
                <div className="badge-row">
                  <span className="badge neutral">Gruppe {game.groupId}</span>
                  {game.isLocked ? <span className="badge warning">Live/gesperrt</span> : <span className="badge success">Offen</span>}
                  <span className="badge">{game.scoreA ?? '-'}:{game.scoreB ?? '-'}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {status && <p className="status error">{status}</p>}
    </div>
  );
}

export default TeamPage;
