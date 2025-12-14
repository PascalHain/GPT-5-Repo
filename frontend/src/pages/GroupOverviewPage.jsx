import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:4000';

function GroupOverviewPage() {
  const [groups, setGroups] = useState([]);
  const [status, setStatus] = useState('');

  const fetchGroups = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/groups`);
      if (!res.ok) {
        throw new Error('Gruppen konnten nicht geladen werden.');
      }
      const data = await res.json();
      setGroups(data);
      setStatus('');
    } catch (error) {
      setStatus(error.message || 'Fehler beim Laden der Gruppen.');
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Überblick</p>
          <h2 className="section-title">Gruppen & Spielplan</h2>
          <p className="muted">
            Alle WM-Gruppen auf einen Blick mit Tabelle, kommenden Anpfiffen und Ergebnissen sobald sie
            eingetragen wurden.
          </p>
        </div>
        <button className="button ghost" onClick={fetchGroups}>
          Aktualisieren
        </button>
      </div>

      <div className="grid">
        {groups.map((group) => (
          <section key={group.id} className="card">
            <header className="card-header">
              <div>
                <p className="eyebrow">{group.id}</p>
                <h3 className="card-title">{group.name}</h3>
                <p className="muted">
                  {group.teams.map((team) => (
                    <Link key={team.code} to={`/teams/${team.code}`} className="inline-flag">
                      <span className="flag">{team.flag}</span> {team.name}
                    </Link>
                  ))}
                </p>
              </div>
            </header>

            <div className="card-body">
              <h4 className="subheading">Tabelle</h4>
              <div className="table-wrapper">
                <table className="table compact">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Team</th>
                      <th>Sp</th>
                      <th>S</th>
                      <th>U</th>
                      <th>N</th>
                      <th>TF</th>
                      <th>TA</th>
                      <th>TD</th>
                      <th>Pkt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.standings.map((row) => (
                      <tr key={row.teamCode}>
                        <td>{row.rank}</td>
                        <td>
                          <Link to={`/teams/${row.teamCode}`} className="inline-flag">
                            <span className="flag">{row.flag}</span> {row.team}
                          </Link>
                        </td>
                        <td>{row.played}</td>
                        <td>{row.wins}</td>
                        <td>{row.draws}</td>
                        <td>{row.losses}</td>
                        <td>{row.goalsFor}</td>
                        <td>{row.goalsAgainst}</td>
                        <td>{row.goalDiff}</td>
                        <td>{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="subheading" style={{ marginTop: '12px' }}>
                Spiele
              </h4>
              <div className="fixture-list">
                {group.fixtures.map((game) => (
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
                      <span className="badge neutral">{game.groupId}</span>
                      {game.isLocked ? (
                        <span className="badge warning">Live/gesperrt</span>
                      ) : (
                        <span className="badge success">Offen</span>
                      )}
                      <span className="badge" aria-label="Ergebnis">
                        {game.scoreA ?? '-'}:{game.scoreB ?? '-'}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {status && <p className="status error">{status}</p>}
    </div>
  );
}

export default GroupOverviewPage;
