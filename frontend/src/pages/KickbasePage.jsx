import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:4000';

const baseSlots = [
  { id: 'gk', label: 'Torwart' },
  { id: 'def1', label: 'Verteidiger 1' },
  { id: 'def2', label: 'Verteidiger 2' },
  { id: 'mid1', label: 'Mittelfeld 1' },
  { id: 'mid2', label: 'Mittelfeld 2' },
  { id: 'mid3', label: 'Mittelfeld 3' },
  { id: 'fwd1', label: 'Sturm 1' },
  { id: 'fwd2', label: 'Sturm 2' },
  { id: 'fwd3', label: 'Sturm 3' },
  { id: 'joker', label: 'Joker' },
  { id: 'coach', label: 'Coach' },
];

function KickbasePage() {
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState('');
  const [savedAt, setSavedAt] = useState('');
  const [lineup, setLineup] = useState(() =>
    baseSlots.map((slot) => ({ ...slot, player: '', teamCode: '' })),
  );

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams`);
      const data = await res.json();
      setTeams(data);
      setStatus('');
    } catch (error) {
      setStatus('Teams konnten nicht geladen werden.');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const topTeams = useMemo(() => {
    return [...teams].sort((a, b) => a.ranking - b.ranking).slice(0, 10);
  }, [teams]);

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
    const filledCount = lineup.filter((slot) => slot.player && slot.teamCode).length;
    if (filledCount === 0) {
      setStatus('Bitte mindestens einen Spieler mit Team auswählen.');
      return;
    }
    const time = new Date().toLocaleTimeString();
    setSavedAt(time);
    setStatus(`Aufstellung gespeichert um ${time}.`);
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
            <p className="muted small">Basierend auf dem hinterlegten WM-2026-Ranking, inkl. Flaggen und Gruppenzugehörigkeit.</p>
          </div>
        </header>
        <div className="chip-row">
          {topTeams.map((team) => (
            <span key={team.code} className="badge neutral">
              {team.flag} {team.name} <span className="muted very-small">(Gruppe {team.groupId})</span>
            </span>
          ))}
        </div>
      </section>

      <section className="card">
        <header className="card-header">
          <div>
            <p className="eyebrow">Aufstellung</p>
            <h3 className="card-title">Startelf & Staff</h3>
            <p className="muted small">Einfach Felder füllen, Teams auswählen und speichern – ganz wie im Kickbase-Lineup.</p>
          </div>
          <div className="save-stack">
            <button className="button" onClick={handleSave}>
              Aufstellung speichern
            </button>
            {savedAt && <span className="save-indicator saved">Gespeichert um {savedAt}</span>}
          </div>
        </header>
        <div className="lineup-grid">
          {lineup.map((slot) => (
            <div key={slot.id} className="lineup-card">
              <p className="muted small">{slot.label}</p>
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
      </section>

      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default KickbasePage;
