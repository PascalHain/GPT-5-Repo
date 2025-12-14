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
      <h1 className="section-title">Rangliste</h1>
      <p>Zeigt die Summe aller Punkte pro Nutzer.</p>
      <button className="button" onClick={fetchScoreboard} style={{ marginBottom: '12px' }}>
        Aktualisieren
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Nutzer</th>
            <th>Punkte</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.userName}>
              <td>{entry.userName}</td>
              <td>{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {status && <p>{status}</p>}
    </div>
  );
}

export default ScoreboardPage;
