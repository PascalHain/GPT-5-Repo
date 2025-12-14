import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:4000';

function ScoreboardPage() {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('');

  const fetchScoreboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/scoreboard`);
      const data = await res.json();
      setEntries(data);
      setStatus('');
    } catch (error) {
      setStatus('Fehler beim Laden der Rangliste.');
    }
  };

  useEffect(() => {
    fetchScoreboard();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Ranking</p>
          <h2 className="section-title">Rangliste & Form</h2>
          <p className="muted">Punkte, exakte Tipps und richtige Tendenzen im Überblick.</p>
        </div>
        <button className="button ghost" onClick={fetchScoreboard} style={{ marginBottom: '12px' }}>
          Aktualisieren
        </button>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Platz</th>
              <th>Nutzer</th>
              <th>Punkte</th>
              <th>Exakt</th>
              <th>Tendenz</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.userName}>
                <td>{index + 1}</td>
                <td>{entry.userName}</td>
                <td>{entry.points}</td>
                <td>{entry.exact}</td>
                <td>{entry.tendency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default ScoreboardPage;
