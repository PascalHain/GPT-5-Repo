import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:4000';

const formatDateTime = (value) => new Date(value).toLocaleString();

function GamesPage() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [userName, setUserName] = useState('');
  const [tipInputs, setTipInputs] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [championPick, setChampionPick] = useState('');
  const [championStatus, setChampionStatus] = useState('');
  const [championLocked, setChampionLocked] = useState(false);
  const [tipSaveState, setTipSaveState] = useState({});

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

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams`);
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      // still allow tipping without teams loaded
    }
  };

  const loadChampionPick = async () => {
    if (!userName) {
      setChampionStatus('Bitte zuerst deinen Nutzernamen eintragen.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/bonus/champion/${encodeURIComponent(userName)}`);
      const data = await res.json();
      if (data.champion) {
        setChampionPick(data.champion.teamCode);
        setChampionStatus('Champion-Tipp geladen.');
      } else {
        setChampionStatus('Kein Champion-Tipp vorhanden, lege los!');
      }
      setChampionLocked(Boolean(data.locked));
    } catch (error) {
      setChampionStatus('Champion-Tipp konnte nicht geladen werden.');
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
      loadChampionPick();
    } catch (error) {
      setStatus('Tipps konnten nicht geladen werden.');
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  const handleChampionSubmit = async () => {
    if (!userName || !championPick) {
      setChampionStatus('Bitte Nutzername und einen Tipp auswählen.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/bonus/champion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, teamCode: championPick }),
      });

      const data = await res.json();
      if (!res.ok) {
        setChampionStatus(data.error || 'Champion-Tipp fehlgeschlagen.');
        setChampionLocked(Boolean(data.locked));
        return;
      }

      setChampionStatus(`Champion-Tipp gespeichert: ${data.team?.flag ?? ''} ${data.team?.name ?? championPick}`.trim());
    } catch (error) {
      setChampionStatus('Champion-Tipp fehlgeschlagen.');
    }
  };

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
      setTipSaveState((prev) => ({ ...prev, [match.id]: { state: 'saving' } }));
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
        setTipSaveState((prev) => ({ ...prev, [match.id]: { state: 'error' } }));
        return;
      }

      const time = new Date().toLocaleTimeString();
      setStatus('Tipp gespeichert!');
      setTipSaveState((prev) => ({ ...prev, [match.id]: { state: 'saved', time } }));
      fetchMatches();
    } catch (error) {
      setStatus('Fehler beim Senden des Tipps.');
      setTipSaveState((prev) => ({ ...prev, [match.id]: { state: 'error' } }));
    }
  };

  const matchesByGroup = useMemo(() => {
    return matches.reduce((acc, match) => {
      const key = match.groupId ?? 'Andere';
      acc[key] = acc[key] ? [...acc[key], match] : [match];
      return acc;
    }, {});
  }, [matches]);

  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name)),
    [teams],
  );

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

      <section className="card">
        <header className="card-header">
          <div>
            <p className="eyebrow">Bonus</p>
            <h3 className="card-title">WM-Sieger 2026 tippen</h3>
            <p className="muted small">Flaggen, Klick auf Teams und nur bis zum globalen Tipp-Schluss bearbeitbar.</p>
          </div>
          <button className="button ghost" onClick={loadChampionPick}>
            Champion laden
          </button>
        </header>
        <div className="card-body">
          <div className="form-row">
            <label htmlFor="champion-select">Dein Sieger</label>
            <select
              id="champion-select"
              className="input wide"
              value={championPick}
              onChange={(e) => setChampionPick(e.target.value)}
              disabled={championLocked}
            >
              <option value="">Bitte wählen</option>
              {sortedTeams.map((team) => (
                <option key={team.code} value={team.code}>
                  {team.flag} {team.name} ({team.groupId})
                </option>
              ))}
            </select>
            <button className="button" onClick={handleChampionSubmit} disabled={championLocked}>
              {championLocked ? 'Gesperrt' : 'Champion speichern'}
            </button>
          </div>
          {championLocked && <p className="muted small">Champion-Tipp ist gesperrt (Turnier gestartet).</p>}
          {championStatus && <p className="status">{championStatus}</p>}
        </div>
      </section>

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
                    const saveState = tipSaveState[match.id];
                    return (
                      <tr key={match.id}>
                        <td>
                          <Link to={`/teams/${match.teamACode}`} className="inline-flag">
                            <span className="flag">{match.teamAFlag}</span> <strong>{match.teamA}</strong>
                          </Link>{' '}
                          vs.{' '}
                          <Link to={`/teams/${match.teamBCode}`} className="inline-flag">
                            <span className="flag">{match.teamBFlag}</span> <strong>{match.teamB}</strong>
                          </Link>
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
                              {locked ? 'Gesperrt' : saveState?.state === 'saving' ? 'Speichert...' : 'Tipp speichern'}
                            </button>
                            <p className="muted small" style={{ marginTop: '6px' }}>
                              {locked ? 'Kickoff erreicht' : 'bis Anpfiff offen'}
                            </p>
                            {saveState?.state === 'saved' && (
                              <span className="save-indicator saved">Gespeichert um {saveState.time}</span>
                            )}
                            {saveState?.state === 'error' && (
                              <span className="save-indicator error">Fehler – erneut versuchen</span>
                            )}
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
