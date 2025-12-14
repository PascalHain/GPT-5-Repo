import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:4000';

const formatDateTime = (value) => new Date(value).toLocaleString();

function GamesPage() {
  const [matches, setMatches] = useState([]);
  const [userName, setUserName] = useState('');
  const [tipInputs, setTipInputs] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/matches`);
      const data = await res.json();
      setMatches(data);
      setStatus('');
    } catch (error) {
      setStatus('Fehler beim Laden der Spiele.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTips = async () => {
    if (!userName) {
      setStatus('Bitte zuerst deinen Nutzernamen eintragen, um Tipps zu laden.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/tips/${encodeURIComponent(userName)}`);
      const tips = await res.json();
      const mapped = tips.reduce((acc, tip) => {
        acc[tip.matchId] = { tipA: tip.tipA.toString(), tipB: tip.tipB.toString() };
        return acc;
      }, {});
      setTipInputs((prev) => ({ ...prev, ...mapped }));
      setStatus(tips.length ? 'Vorhandene Tipps geladen.' : 'Keine Tipps gefunden, lege los!');
    } catch (error) {
      setStatus('Tipps konnten nicht geladen werden.');
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleTipChange = (matchId, field, value) => {
    setTipInputs((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (match) => {
    const gameTips = tipInputs[match.id] || {};
    if (!userName || gameTips.tipA === undefined || gameTips.tipB === undefined) {
      setStatus('Bitte Nutzername und beide Tippwerte ausfüllen.');
      return;
    }

    if (match.isLocked) {
      setStatus('Das Spiel ist bereits gesperrt.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/tips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          matchId: match.id,
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
      fetchMatches();
    } catch (error) {
      setStatus('Fehler beim Senden des Tipps.');
    }
  };

  const matchesByGroup = useMemo(() => {
    return matches.reduce((acc, match) => {
      const key = match.groupId ?? 'Andere';
      acc[key] = acc[key] ? [...acc[key], match] : [match];
      return acc;
    }, {});
  }, [matches]);

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Tipprunde</p>
          <h2 className="section-title">Spiele tippen</h2>
          <p className="muted">
            Trage deinen Nutzernamen ein, lade bestehende Tipps und gib Ergebnisse für jedes Spiel ab. Tipps sind bis
            zum Anpfiff änderbar.
          </p>
        </div>
        <button className="button ghost" onClick={fetchMatches} disabled={loading}>
          {loading ? 'Laden...' : 'Aktualisieren'}
        </button>
      </div>

      <div className="form-row">
        <label htmlFor="username">Nutzername</label>
        <input
          id="username"
          className="input wide"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="z. B. Alex"
        />
        <button className="button secondary" onClick={fetchUserTips}>
          Meine Tipps laden
        </button>
      </div>

      {Object.keys(matchesByGroup)
        .sort()
        .map((groupKey) => (
        <section key={groupKey} className="card">
          <header className="card-header">
            <div>
              <p className="eyebrow">Gruppe {groupKey}</p>
              <h3 className="card-title">Spiele</h3>
            </div>
          </header>
          <div className="card-body">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Match</th>
                    <th>Anpfiff</th>
                    <th>Ort</th>
                    <th>Tipp A</th>
                    <th>Tipp B</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {matchesByGroup[groupKey].map((match) => {
                    const values = tipInputs[match.id] || {};
                    const locked = match.isLocked;
                    return (
                      <tr key={match.id}>
                        <td>
                          <strong>{match.teamA}</strong> vs. <strong>{match.teamB}</strong>
                          <div className="muted small">
                            Ergebnis: {match.scoreA ?? '-'} : {match.scoreB ?? '-'}
                          </div>
                        </td>
                        <td>{formatDateTime(match.kickoff)}</td>
                        <td className="muted small">{match.venue}</td>
                        <td>
                          <input
                            className="input"
                            type="number"
                            value={values.tipA ?? ''}
                            onChange={(e) => handleTipChange(match.id, 'tipA', e.target.value)}
                            disabled={locked}
                          />
                        </td>
                        <td>
                          <input
                            className="input"
                            type="number"
                            value={values.tipB ?? ''}
                            onChange={(e) => handleTipChange(match.id, 'tipB', e.target.value)}
                            disabled={locked}
                          />
                        </td>
                        <td>
                          <div className={locked ? 'status-chip locked' : 'status-chip'}>
                            <button className="button" disabled={locked} onClick={() => handleSubmit(match)}>
                              {locked ? 'Gesperrt' : 'Tipp speichern'}
                            </button>
                            <p className="muted small" style={{ marginTop: '6px' }}>
                              {locked ? 'Kickoff erreicht' : 'bis Anpfiff offen'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}

      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default GamesPage;
