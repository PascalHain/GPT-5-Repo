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
  { id: 'gk', label: 'Torwart', lane: 'keeper', top: 82, left: 50 },
  { id: 'lb', label: 'Linksverteidiger', lane: 'defense', top: 70, left: 25 },
  { id: 'cb1', label: 'Innenverteidiger links', lane: 'defense', top: 68, left: 43 },
  { id: 'cb2', label: 'Innenverteidiger rechts', lane: 'defense', top: 68, left: 57 },
  { id: 'rb', label: 'Rechtsverteidiger', lane: 'defense', top: 70, left: 75 },
  { id: 'dm', label: 'Sechser', lane: 'midfield', top: 56, left: 50 },
  { id: 'cm', label: 'Achter', lane: 'midfield', top: 46, left: 35 },
  { id: 'am', label: 'Zehner', lane: 'midfield', top: 46, left: 65 },
  { id: 'lw', label: 'Linksaußen', lane: 'attack', top: 30, left: 25 },
  { id: 'st', label: 'Mittelstürmer', lane: 'attack', top: 24, left: 50 },
  { id: 'rw', label: 'Rechtsaußen', lane: 'attack', top: 30, left: 75 },
];

const bestXIByTeam = {
  ARG: {
    gk: 'Emiliano Martínez',
    lb: 'Nicolás Tagliafico',
    cb1: 'Cristian Romero',
    cb2: 'Lisandro Martínez',
    rb: 'Nahuel Molina',
    dm: 'Enzo Fernández',
    cm: 'Alexis Mac Allister',
    am: 'Lionel Messi',
    lw: 'Ángel Di María',
    st: 'Julián Álvarez',
    rw: 'Nico González',
  },
  FRA: {
    gk: 'Mike Maignan',
    lb: 'Theo Hernández',
    cb1: 'Dayot Upamecano',
    cb2: 'William Saliba',
    rb: 'Jules Koundé',
    dm: 'Aurélien Tchouaméni',
    cm: 'Adrien Rabiot',
    am: 'Antoine Griezmann',
    lw: 'Kylian Mbappé',
    st: 'Olivier Giroud',
    rw: 'Ousmane Dembélé',
  },
  BRA: {
    gk: 'Alisson Becker',
    lb: 'Renan Lodi',
    cb1: 'Marquinhos',
    cb2: 'Éder Militão',
    rb: 'Danilo',
    dm: 'Bruno Guimarães',
    cm: 'Lucas Paquetá',
    am: 'Rodrygo',
    lw: 'Vinícius Jr.',
    st: 'Richarlison',
    rw: 'Raphinha',
  },
  ENG: {
    gk: 'Jordan Pickford',
    lb: 'Luke Shaw',
    cb1: 'John Stones',
    cb2: 'Harry Maguire',
    rb: 'Kyle Walker',
    dm: 'Declan Rice',
    cm: 'Jude Bellingham',
    am: 'Phil Foden',
    lw: 'Marcus Rashford',
    st: 'Harry Kane',
    rw: 'Bukayo Saka',
  },
  BEL: {
    gk: 'Koen Casteels',
    lb: 'Arthur Theate',
    cb1: 'Wout Faes',
    cb2: 'Zeno Debast',
    rb: 'Timothy Castagne',
    dm: 'Amadou Onana',
    cm: 'Youri Tielemans',
    am: 'Kevin De Bruyne',
    lw: 'Jérémy Doku',
    st: 'Romelu Lukaku',
    rw: 'Leandro Trossard',
  },
  CRO: {
    gk: 'Dominik Livaković',
    lb: 'Borna Sosa',
    cb1: 'Joško Gvardiol',
    cb2: 'Domagoj Vida',
    rb: 'Josip Juranović',
    dm: 'Marcelo Brozović',
    cm: 'Mateo Kovačić',
    am: 'Luka Modrić',
    lw: 'Andrej Kramarić',
    st: 'Bruno Petković',
    rw: 'Ivan Perišić',
  },
  ESP: {
    gk: 'Unai Simón',
    lb: 'Alejandro Grimaldo',
    cb1: 'Aymeric Laporte',
    cb2: 'Robin Le Normand',
    rb: 'Dani Carvajal',
    dm: 'Rodri',
    cm: 'Pedri',
    am: 'Gavi',
    lw: 'Nico Williams',
    st: 'Álvaro Morata',
    rw: 'Lamine Yamal',
  },
  NED: {
    gk: 'Justin Bijlow',
    lb: 'Nathan Aké',
    cb1: 'Virgil van Dijk',
    cb2: 'Matthijs de Ligt',
    rb: 'Denzel Dumfries',
    dm: 'Marten de Roon',
    cm: 'Frenkie de Jong',
    am: 'Xavi Simons',
    lw: 'Cody Gakpo',
    st: 'Memphis Depay',
    rw: 'Steven Bergwijn',
  },
  POR: {
    gk: 'Diogo Costa',
    lb: 'Nuno Mendes',
    cb1: 'Rúben Dias',
    cb2: 'António Silva',
    rb: 'João Cancelo',
    dm: 'João Palhinha',
    cm: 'Bruno Fernandes',
    am: 'Bernardo Silva',
    lw: 'João Félix',
    st: 'Gonçalo Ramos',
    rw: 'Diogo Jota',
  },
  MAR: {
    gk: 'Yassine Bounou',
    lb: 'Noussair Mazraoui',
    cb1: 'Romain Saïss',
    cb2: 'Nayef Aguerd',
    rb: 'Achraf Hakimi',
    dm: 'Sofyan Amrabat',
    cm: 'Azzedine Ounahi',
    am: 'Hakim Ziyech',
    lw: 'Sofiane Boufal',
    st: 'Youssef En-Nesyri',
    rw: 'Abdelhamid Sabiri',
  },
};

function KickbasePage() {
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState('');
  const [savedAt, setSavedAt] = useState('');
  const [activeTemplate, setActiveTemplate] = useState('');
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

  useEffect(() => {
    if (!activeTemplate && topTeams.length > 0) {
      setActiveTemplate(topTeams[0].code);
    }
  }, [activeTemplate, topTeams]);

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

  const applyTemplate = (teamCode) => {
    const template = bestXIByTeam[teamCode];
    if (!template) {
      setStatus('Für dieses Team liegt keine Startelf-Vorlage vor.');
      return;
    }

    setActiveTemplate(teamCode);
    setLineup((prev) =>
      baseSlots.map((slot) => ({
        ...slot,
        player: template[slot.id] || '',
        teamCode,
      })),
    );
    setStatus(`Startelf ${teamCode} übernommen – jetzt nach Wunsch anpassen.`);
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
            Wähle Spieler aus den 10 Top-Favoriten-Nationalteams (nach FIFA-Ranking) und stelle deine Startelf. Alles lokal
            gespeichert – perfekt zum Durchspielen vor dem Turnierstart.
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
              Basierend auf dem hinterlegten WM-2026-Ranking, inkl. Flaggen, Gruppen und Mini-Storylines. Startelf-Buttons
              laden direkt eine Kickbase-taugliche 4-3-3.
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
              {bestXIByTeam[team.code] && (
                <div className="mini-xi">
                  {Object.entries(bestXIByTeam[team.code]).map(([key, player]) => (
                    <span key={key} className="pill tiny">
                      {player}
                    </span>
                  ))}
                </div>
              )}
              <button className="button ghost" onClick={() => applyTemplate(team.code)}>
                Startelf übernehmen
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <header className="card-header lineup-head">
          <div>
            <p className="eyebrow">Aufstellung</p>
            <h3 className="card-title">Startelf auf dem Spielfeld</h3>
            <p className="muted small">Visuelles Feld mit 4-3-3 – Trainer entfallen, nur die beste Elf zählt.</p>
          </div>
          <div className="save-stack">
            <div className="pill-stats">
              <span className="pill">{filledCount}/11 Plätze besetzt</span>
              <span className="pill ghost">Aktive Vorlage: {activeTemplate || 'frei'}</span>
            </div>
            <button className="button" onClick={handleSave}>
              Aufstellung speichern
            </button>
            {savedAt && <span className="save-indicator saved">Gespeichert um {savedAt}</span>}
          </div>
        </header>

        <div className="lineup-layout">
          <div className="pitch-panel">
            <div className="pitch">
              <div className="pitch-lines" aria-hidden />
              {lineup.map((slot) => {
                const team = topTeams.find((t) => t.code === slot.teamCode);
                return (
                  <div key={slot.id} className="pitch-slot" style={{ left: `${slot.left}%`, top: `${slot.top}%` }}>
                    <div className="player-chip">
                      <span className="flag">{team?.flag || '⚽️'}</span>
                      <div>
                        <p className="player-name">{slot.player || 'Spieler wählen'}</p>
                        <p className="muted tiny">{slot.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lineup-editor">
            <div className="lane-grid">
              {lineup.map((slot) => (
                <div key={slot.id} className="lineup-card">
                  <div className="lineup-card-head">
                    <p className="muted very-small">{slot.label}</p>
                    <span className="pill tiny">{slot.id.toUpperCase()}</span>
                  </div>
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
                    <p className="muted very-small">{topTeams.find((t) => t.code === slot.teamCode)?.storyline || ''}</p>
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
