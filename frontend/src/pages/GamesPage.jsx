import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:4000';

function GamesPage() {
  const [games, setGames] = useState([]);
  const [userName, setUserName] = useState('');
  const [tipInputs, setTipInputs] = useState({});
  const [status, setStatus] = useState('');

  const fetchGames = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/games`);
      const data = await res.json();
      setGames(data);
    } catch (error) {
      setStatus('Fehler beim Laden der Spiele.');
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleTipChange = (gameId, field, value) => {
    setTipInputs((prev) => ({
      ...prev,
      [gameId]: {
        ...prev[gameId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (gameId) => {
    const gameTips = tipInputs[gameId] || {};
    if (!userName || gameTips.tipA === undefined || gameTips.tipB === undefined) {
      setStatus('Bitte Nutzername und beide Tippwerte ausfüllen.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/tips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          gameId,
          tipA: Number(gameTips.tipA),
          tipB: Number(gameTips.tipB),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setStatus(errorData.error || 'Fehler beim Senden des Tipps.');
        return;
      }

      setStatus('Tipp gespeichert!');
      setUserName(userName);
      setTipInputs((prev) => ({ ...prev, [gameId]: { tipA: '', tipB: '' } }));
    } catch (error) {
      setStatus('Fehler beim Senden des Tipps.');
    }
  };

  return (
    <div>
      <h1 className="section-title">Spiele</h1>
      <p>Trage deinen Nutzernamen ein und tippe die Ergebnisse. Über den Button kannst du Spiele neu laden.</p>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div className="form-row" style={{ marginBottom: 0 }}>
          <label htmlFor="username">Nutzername:</label>
          <input
            id="username"
            className="input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="z. B. Alex"
          />
        </div>
        <button className="button" type="button" onClick={fetchGames}>
          Spiele aktualisieren
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Match</th>
            <th>Datum</th>
            <th>Gruppe</th>
            <th>Stadion</th>
            <th>Tipp Team A</th>
            <th>Tipp Team B</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const values = tipInputs[game.id] || {};
            return (
              <tr key={game.id}>
                <td>
                  {game.teamA} vs. {game.teamB}
                  <div style={{ fontSize: '0.9rem', color: '#475569' }}>
                    Ergebnis: {game.scoreA ?? '-'} : {game.scoreB ?? '-'}
                  </div>
                </td>
                <td>{new Date(game.date).toLocaleString()}</td>
                <td>{game.group || '-'}</td>
                <td>{game.stadium || '-'}</td>
                <td>
                  <input
                    className="input"
                    type="number"
                    value={values.tipA ?? ''}
                    onChange={(e) => handleTipChange(game.id, 'tipA', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="input"
                    type="number"
                    value={values.tipB ?? ''}
                    onChange={(e) => handleTipChange(game.id, 'tipB', e.target.value)}
                  />
                </td>
                <td>
                  <button className="button" onClick={() => handleSubmit(game.id)}>
                    Tipp speichern
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {status && <p>{status}</p>}
    </div>
  );
}

export default GamesPage;
