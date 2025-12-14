import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:4000';
const STORAGE_KEY = 'kickbase-wm-lineup';
const STORAGE_SAVED_AT_KEY = 'kickbase-wm-lineup-saved-at';

const kickbaseFavorites = [
  { code: 'ARG', name: 'Argentinien', flag: '🇦🇷', ranking: 1 },
  { code: 'FRA', name: 'Frankreich', flag: '🇫🇷', ranking: 2 },
  { code: 'BRA', name: 'Brasilien', flag: '🇧🇷', ranking: 3 },
  { code: 'ENG', name: 'England', flag: '🏴', ranking: 4 },
  { code: 'BEL', name: 'Belgien', flag: '🇧🇪', ranking: 5 },
  { code: 'CRO', name: 'Kroatien', flag: '🇭🇷', ranking: 6 },
  { code: 'ESP', name: 'Spanien', flag: '🇪🇸', ranking: 7 },
  { code: 'NED', name: 'Niederlande', flag: '🇳🇱', ranking: 8 },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', ranking: 9 },
  { code: 'MAR', name: 'Marokko', flag: '🇲🇦', ranking: 10 },
];

const baseSlots = [
  { id: 'gk', label: 'Torwart', lane: 'keeper' },
  { id: 'def1', label: 'Innenverteidiger', lane: 'defense' },
  { id: 'def2', label: 'Außenverteidiger', lane: 'defense' },
  { id: 'mid1', label: 'Zentraler Mittelfeldspieler', lane: 'midfield' },
  { id: 'mid2', label: 'Achter', lane: 'midfield' },
  { id: 'mid3', label: 'Zehner', lane: 'midfield' },
  { id: 'fwd1', label: 'Neuner', lane: 'attack' },
  { id: 'fwd2', label: 'Halbstürmer', lane: 'attack' },
  { id: 'fwd3', label: 'Flügel', lane: 'attack' },
  { id: 'joker', label: 'Joker von der Bank', lane: 'bench' },
  { id: 'coach', label: 'Coach', lane: 'bench' },
];

function KickbasePage() {
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState('');
  const [savedAt, setSavedAt] = useState('');
  const [lineup, setLineup] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return baseSlots.map((slot) => parsed.find((p) => p.id === slot.id) || { ...slot, player: '', teamCode: '' });
      } catch (error) {
        console.warn('Konnte gespeichertes Lineup nicht laden', error);
      }
    }
    return baseSlots.map((slot) => ({ ...slot, player: '', teamCode: '' }));
  });

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams`);
      if (!res.ok) {
        throw new Error('Server antwortet nicht erfolgreich.');
      }
      const data = await res.json();
      setTeams(data);
      setStatus('Teams geladen – wähle deine Favoriten.');
    } catch (error) {
      setStatus('Teams konnten nicht geladen werden. Fallback: Top 10 Ranking geladen.');
      setTeams(kickbaseFavorites);
    }
  };

  useEffect(() => {
    fetchTeams();
    const savedTime = localStorage.getItem(STORAGE_SAVED_AT_KEY);
    if (savedTime) setSavedAt(savedTime);
  }, []);

  const topTeams = useMemo(() => {
    return [...teams].sort((a, b) => a.ranking - b.ranking).slice(0, 10);
  }, [teams]);

  const filledCount = lineup.filter((slot) => slot.player && slot.teamCode).length;
  const teamUsage = useMemo(() => {
    const usage = {};
    lineup.forEach((slot) => {
      if (!slot.teamCode) return;
      usage[slot.teamCode] = (usage[slot.teamCode] || 0) + 1;
    });
    return usage;
  }, [lineup]);

  const handleChange = (slotId, field, value) => {
    setLineup((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              [field]: value,
            }
          : slot,
      ),
    );
  };

  const handleSave = () => {
    if (filledCount === 0) {
      setStatus('Bitte mindestens einen Spieler mit Team auswählen.');
      return;
    }
    const time = new Date().toLocaleString();
    setSavedAt(time);
    setStatus(`Aufstellung gespeichert um ${time}.`);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineup));
    localStorage.setItem(STORAGE_SAVED_AT_KEY, time);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Kickbase WM</p>
          <h2 className="section-title">Deine Fantasy-Aufstellung</h2>
          <p className="muted">
            Wähle Spieler aus den 10 Top-Favoriten-Nationalteams (nach FIFA-Ranking) und stelle dein Team zusammen. Alles
            lokal gespeichert – perfekt zum Durchspielen vor dem Turnierstart.
          </p>
        </div>
        <button className="button ghost" onClick={fetchTeams}>
          Teams neu laden
        </button>
      </div>

      <section className="card">
        <header className="card-header">
          <div>
            <p className="eyebrow">Auswahl</p>
            <h3 className="card-title">Top 10 Nationen für Kickbase</h3>
            <p className="muted small">
              Basierend auf dem hinterlegten WM-2026-Ranking, inkl. Flaggen, Gruppen und Mini-Storylines.
            </p>
          </div>
        </header>
        <div className="team-grid">
          {topTeams.map((team) => (
            <article key={team.code} className="team-card">
              <header className="team-card-header">
                <span className="flag big">{team.flag}</span>
                <div>
                  <p className="eyebrow">#{team.ranking}</p>
                  <h4 className="card-title">{team.name}</h4>
                  {team.groupId && (
                    <p className="muted very-small">Gruppe {team.groupId}</p>
                  )}
                </div>
              </header>
              <p className="muted very-small">{team.storyline || 'Top-Favorit laut Ranking.'}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <header className="card-header lineup-head">
          <div>
            <p className="eyebrow">Aufstellung</p>
            <h3 className="card-title">Startelf & Staff</h3>
            <p className="muted small">Einfach Felder füllen, Teams auswählen und speichern – ganz wie im Kickbase-Lineup.</p>
          </div>
          <div className="save-stack">
            <div className="pill-stats">
              <span className="pill">{filledCount}/11 Plätze besetzt</span>
              <span className="pill ghost">Budget: 150 Mio. (fiktiv)</span>
            </div>
            <button className="button" onClick={handleSave}>
              Aufstellung speichern
            </button>
            {savedAt && <span className="save-indicator saved">Gespeichert um {savedAt}</span>}
          </div>
        </header>

        <div className="lineup-layout">
          <div className="lineup-formation">
            {['keeper', 'defense', 'midfield', 'attack'].map((lane) => (
              <div key={lane} className={`lane lane-${lane}`}>
                <p className="muted very-small lane-label">{lane === 'keeper' ? 'Tor' : lane === 'defense' ? 'Abwehr' : lane === 'midfield' ? 'Mittelfeld' : 'Sturm'}</p>
                <div className="lane-grid">
                  {lineup
                    .filter((slot) => slot.lane === lane)
                    .map((slot) => (
                      <div key={slot.id} className="lineup-card">
                        <p className="muted very-small">{slot.label}</p>
                        <input
                          className="input wide"
                          value={slot.player}
                          placeholder="Spielername"
                          onChange={(e) => handleChange(slot.id, 'player', e.target.value)}
                        />
                        <select
                          className="input wide"
                          value={slot.teamCode}
                          onChange={(e) => handleChange(slot.id, 'teamCode', e.target.value)}
                        >
                          <option value="">Team wählen</option>
                          {topTeams.map((team) => (
                            <option key={team.code} value={team.code}>
                              {team.flag} {team.name}
                            </option>
                          ))}
                        </select>
                        {slot.teamCode && (
                          <p className="muted very-small">
                            {topTeams.find((t) => t.code === slot.teamCode)?.storyline || ''}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bench-panel">
            <p className="muted very-small bench-label">Bank & Coach</p>
            <div className="bench-grid">
              {lineup
                .filter((slot) => slot.lane === 'bench')
                .map((slot) => (
                  <div key={slot.id} className="lineup-card">
                    <p className="muted very-small">{slot.label}</p>
                    <input
                      className="input wide"
                      value={slot.player}
                      placeholder="Name"
                      onChange={(e) => handleChange(slot.id, 'player', e.target.value)}
                    />
                    <select
                      className="input wide"
                      value={slot.teamCode}
                      onChange={(e) => handleChange(slot.id, 'teamCode', e.target.value)}
                    >
                      <option value="">Team wählen</option>
                      {topTeams.map((team) => (
                        <option key={team.code} value={team.code}>
                          {team.flag} {team.name}
                        </option>
                      ))}
                    </select>
                    {slot.teamCode && (
                      <p className="muted very-small">
                        {topTeams.find((t) => t.code === slot.teamCode)?.storyline || ''}
                      </p>
                    )}
                  </div>
                ))}
            </div>

            <div className="usage-list">
              <p className="muted small">Team-Kontingent</p>
              {Object.keys(teamUsage).length === 0 && <p className="muted very-small">Noch keine Auswahl.</p>}
              {Object.entries(teamUsage)
                .sort(([, a], [, b]) => b - a)
                .map(([code, count]) => {
                  const team = topTeams.find((t) => t.code === code);
                  return (
                    <div key={code} className="usage-row">
                      <span className="flag">{team?.flag}</span>
                      <span className="muted small">{team?.name || code}</span>
                      <span className="pill small">{count}x</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {status && <p className="status info">{status}</p>}
    </div>
  );
}

export default KickbasePage;
