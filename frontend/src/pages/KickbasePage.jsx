import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'kickbase-wm-lineup-v2';
const STORAGE_SAVED_AT_KEY = 'kickbase-wm-lineup-saved-at-v2';

const kickbaseFavorites = [
  { code: 'ARG', name: 'Argentinien', flag: '🇦🇷', ranking: 1 },
  { code: 'FRA', name: 'Frankreich', flag: '🇫🇷', ranking: 2 },
  { code: 'BRA', name: 'Brasilien', flag: '🇧🇷', ranking: 3 },
  { code: 'ENG', name: 'England', flag: '🏴', ranking: 4 },
  { code: 'ESP', name: 'Spanien', flag: '🇪🇸', ranking: 7 },
  { code: 'GER', name: 'Deutschland', flag: '🇩🇪', ranking: 12 },
];

const topTeamCodes = ['ARG', 'FRA', 'BRA', 'ENG', 'ESP', 'GER'];

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
  { id: 'joker', label: 'Joker', lane: 'bench', top: 90, left: 12 },
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
    cm: 'Eduardo Camavinga',
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
  GER: {
    gk: 'Manuel Neuer',
    lb: 'David Raum',
    cb1: 'Antonio Rüdiger',
    cb2: 'Jonathan Tah',
    rb: 'Joshua Kimmich',
    dm: 'Robert Andrich',
    cm: 'İlkay Gündoğan',
    am: 'Jamal Musiala',
    lw: 'Leroy Sané',
    st: 'Niclas Füllkrug',
    rw: 'Florian Wirtz',
  },
};

const flagForTeam = (code) => kickbaseFavorites.find((t) => t.code === code)?.flag || '🏳️';

const buildPlayerPool = () => {
  const fullPool = [];
  topTeamCodes.forEach((code) => {
    const lineup = bestXIByTeam[code];
    Object.entries(lineup).forEach(([position, name]) => {
      fullPool.push({
        id: `${code}-${position}`,
        name,
        position,
        teamCode: code,
        flag: flagForTeam(code),
      });
    });
  });

  const lanes = {
    keeper: ['gk'],
    defense: ['lb', 'cb1', 'cb2', 'rb'],
    midfield: ['dm', 'cm', 'am'],
    attack: ['lw', 'st', 'rw'],
  };

  const pickFrom = (positions, count) => {
    const candidates = fullPool.filter((p) => positions.includes(p.position));
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const curated = [
    ...pickFrom(lanes.keeper, 1),
    ...pickFrom(lanes.defense, 3),
    ...pickFrom(lanes.midfield, 3),
    ...pickFrom(lanes.attack, 3),
  ];

  const remainder = fullPool
    .filter((p) => !curated.find((c) => c.id === p.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  return [...curated, ...remainder].slice(0, 12);
};

const seedLineupFromPool = (pool) =>
  baseSlots.map((slot) => {
    const match = pool.find((p) => p.position === slot.id);
    if (match) {
      return { ...slot, player: match.name, teamCode: match.teamCode, flag: match.flag, fromPoolId: match.id };
    }
    const fallback = pool.find((p) => p.position.includes(slot.lane)) || pool[0];
    if (fallback) {
      return { ...slot, player: fallback.name, teamCode: fallback.teamCode, flag: fallback.flag, fromPoolId: fallback.id };
    }
    return { ...slot, player: '', teamCode: '', flag: '' };
  });

function KickbasePage() {
  const [playerPool, setPlayerPool] = useState([]);
  const [lineup, setLineup] = useState(baseSlots);
  const [selectedSlot, setSelectedSlot] = useState('gk');
  const [savedAt, setSavedAt] = useState('');
  const [activeTab, setActiveTab] = useState('team');
  const [status, setStatus] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');

  useEffect(() => {
    const storedLineup = localStorage.getItem(STORAGE_KEY);
    const storedSavedAt = localStorage.getItem(STORAGE_SAVED_AT_KEY);
    const pool = buildPlayerPool();
    setPlayerPool(pool);

    if (storedLineup) {
      try {
        const parsed = JSON.parse(storedLineup);
        setLineup(baseSlots.map((slot) => parsed.find((p) => p.id === slot.id) || slot));
      } catch (error) {
        setLineup(seedLineupFromPool(pool));
      }
    } else {
      setLineup(seedLineupFromPool(pool));
    }

    if (storedSavedAt) {
      setSavedAt(storedSavedAt);
    }
  }, []);

  const assignPlayer = (slotId, player) => {
    setLineup((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, player: player.name, teamCode: player.teamCode, flag: player.flag, fromPoolId: player.id } : slot,
      ),
    );
    setSelectedSlot(slotId);
    setStatus(`${player.flag} ${player.name} in ${slotId.toUpperCase()} übernommen.`);
  };

  const updateName = (slotId, name) => {
    setLineup((prev) => prev.map((slot) => (slot.id === slotId ? { ...slot, player: name } : slot)));
  };

  const saveLineup = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineup));
    const timestamp = new Date().toLocaleString();
    localStorage.setItem(STORAGE_SAVED_AT_KEY, timestamp);
    setSavedAt(timestamp);
    setStatus('Aufstellung gespeichert.');
  };

  const reshufflePool = () => {
    const pool = buildPlayerPool();
    setPlayerPool(pool);
    setLineup(seedLineupFromPool(pool));
    setStatus('Neuer 12er-Pool geladen und 4-3-3 befüllt.');
  };

  const applyTemplate = (teamCode) => {
    const template = bestXIByTeam[teamCode];
    if (!template) return;

    const next = baseSlots.map((slot) => {
      const name = template[slot.id];
      if (!name) return { ...slot };
      return {
        ...slot,
        player: name,
        teamCode,
        flag: flagForTeam(teamCode),
        fromPoolId: `${teamCode}-${slot.id}`,
      };
    });
    setLineup(next);
    setStatus(`${flagForTeam(teamCode)} ${teamCode} Vorlage übernommen.`);
  };

  const selectedData = lineup.find((slot) => slot.id === selectedSlot) || lineup[0];

  const unassignedPool = useMemo(() => {
    const usedIds = new Set(lineup.map((slot) => slot.fromPoolId));
    return playerPool.filter((p) => !usedIds.has(p.id));
  }, [lineup, playerPool]);

  const filteredPool = playerPool.filter((p) => {
    const byTeam = teamFilter === 'all' || p.teamCode === teamFilter;
    const byPos =
      positionFilter === 'all' ||
      p.position === positionFilter ||
      (positionFilter === 'defense' && ['lb', 'cb1', 'cb2', 'rb'].includes(p.position)) ||
      (positionFilter === 'midfield' && ['dm', 'cm', 'am'].includes(p.position)) ||
      (positionFilter === 'attack' && ['lw', 'st', 'rw'].includes(p.position));
    return byTeam && byPos;
  });

  return (
    <div className="stack-xl">
      <div className="mode-header">
        <div>
          <p className="eyebrow">Kickbase WM</p>
          <h1>Dashboard mit Team, News, Transfermarkt & Live-Punkte</h1>
          <p className="muted">Top 5 + Deutschland, zufälliger 12er-Pool und 4-3-3 Aufstellung wie bei Kickbase.</p>
        </div>
        <div className="mode-tabs center">
          {['team', 'news', 'transfer', 'live'].map((id) => (
            <button key={id} className={activeTab === id ? 'mode-tab active' : 'mode-tab'} onClick={() => setActiveTab(id)}>
              {id === 'team' && 'Team'}
              {id === 'news' && 'News'}
              {id === 'transfer' && 'Transfermarkt'}
              {id === 'live' && 'Live-Punkte'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'team' && (
        <div className="grid-2">
          <div className="card stack-md">
            <div className="card-header-row">
              <h2>Spielerpool (12 zufällig)</h2>
              <button className="ghost" onClick={reshufflePool}>
                Pool neu mischen
              </button>
            </div>
            <p className="muted">Tippe einen Slot auf dem Feld an und klicke dann einen Spieler, um ihn zuzuweisen.</p>

            <div className="filter-row">
              <div className="pill-row">
                <button className={teamFilter === 'all' ? 'pill active' : 'pill'} onClick={() => setTeamFilter('all')}>
                  Alle Teams
                </button>
                {kickbaseFavorites.map((team) => (
                  <button
                    key={team.code}
                    className={teamFilter === team.code ? 'pill active' : 'pill'}
                    onClick={() => setTeamFilter(team.code)}
                  >
                    {team.flag} {team.name}
                  </button>
                ))}
              </div>
              <div className="pill-row wrap">
                {[
                  { id: 'all', label: 'Alle Positionen' },
                  { id: 'gk', label: 'Torhüter' },
                  { id: 'defense', label: 'Abwehr' },
                  { id: 'midfield', label: 'Mittelfeld' },
                  { id: 'attack', label: 'Angriff' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    className={positionFilter === opt.id ? 'pill active' : 'pill'}
                    onClick={() => setPositionFilter(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="player-pool">
              {filteredPool.map((player) => (
                <button key={player.id} className="player-chip" onClick={() => assignPlayer(selectedSlot, player)}>
                  <span className="flag">{player.flag}</span>
                  <div>
                    <strong>{player.name}</strong>
                    <p className="muted">{player.teamCode} · {player.position.toUpperCase()}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="muted small">Verbleibend unverplant: {unassignedPool.length} Spieler</div>
          </div>

          <div className="card stack-md">
            <div className="card-header-row">
              <h2>4-3-3 Spielfeld</h2>
              <button className="primary" onClick={saveLineup}>Aufstellung speichern</button>
            </div>
            <p className="muted">Klick auf eine Position zum Markieren, dann Spieler aus dem Pool zuweisen oder Namen überschreiben.</p>
            <div className="pitch">
              {lineup.map((slot) => (
                <button
                  key={slot.id}
                  className={selectedSlot === slot.id ? 'pitch-slot selected' : 'pitch-slot'}
                  style={{ top: `${slot.top}%`, left: `${slot.left}%` }}
                  onClick={() => setSelectedSlot(slot.id)}
                >
                  <span className="flag">{slot.flag || '⚽'}</span>
                  <strong>{slot.player || slot.label}</strong>
                  <p className="muted tiny">{slot.label}</p>
                </button>
              ))}
            </div>
            <div className="slot-editor">
              <div>
                <p className="eyebrow">Ausgewählt</p>
                <h3>{selectedData?.label}</h3>
              </div>
              <div className="pill-row wrap">
                {kickbaseFavorites.map((team) => (
                  <button key={team.code} className="pill" onClick={() => applyTemplate(team.code)}>
                    Vorlage {team.flag} {team.name}
                  </button>
                ))}
              </div>
              <div className="field-group">
                <label>Spielername anpassen</label>
                <input
                  type="text"
                  value={selectedData?.player || ''}
                  onChange={(e) => updateName(selectedData.id, e.target.value)}
                  placeholder="Name eintragen"
                />
              </div>
              <div className="field-row">
                {unassignedPool.slice(0, 3).map((p) => (
                  <button key={p.id} className="secondary" onClick={() => assignPlayer(selectedData.id, p)}>
                    {p.flag} {p.name}
                  </button>
                ))}
              </div>
              {savedAt && <p className="muted tiny">Zuletzt gespeichert: {savedAt}</p>}
              {status && <p className="status success">{status}</p>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'news' && (
        <div className="grid-2">
          <div className="card">
            <h2>Top-Schlagzeilen</h2>
            <ul className="bullet-list">
              <li>Deutschland formt junges 4-3-3 um Musiala und Wirtz.</li>
              <li>Brasilien setzt auf pfeilschnelles Flügelspiel mit Vini Jr.</li>
              <li>Messi führt Argentinien erneut als Spielmacher.</li>
            </ul>
          </div>
          <div className="card">
            <h2>Verletzungen & Sperren</h2>
            <p className="muted">Aktualisiere deine Startelf, sobald neue Infos droppen.</p>
            <ul className="bullet-list">
              <li>England: Shaw fraglich, Walker fit.</li>
              <li>Spanien: Pedri geschont, Morata gesetzt.</li>
              <li>Frankreich: Maignan trainiert individuell.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'transfer' && (
        <div className="grid-2">
          <div className="card">
            <h2>Transfermarkt Trends</h2>
            <ul className="bullet-list">
              <li>Beliebt: Mbappé, Musiala, Vinícius Jr.</li>
              <li>Geheimtipps: Grimaldo, Andrich, En-Nesyri.</li>
              <li>Torwart-Snipes: Maignan, Alisson, Neuer.</li>
            </ul>
          </div>
          <div className="card">
            <h2>Budget-Tipps</h2>
            <p className="muted">Low-Cost Picks für späte Spieltage.</p>
            <ul className="bullet-list">
              <li>Hakimi für Flanken & Punkte aus Defensive.</li>
              <li>Trossard als Joker mit hoher Form.</li>
              <li>Paquetá für Bonus durch Pässe & Abschlüsse.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'live' && (
        <div className="grid-2">
          <div className="card">
            <h2>Live-Punkte</h2>
            <p className="muted">Simulierte Punkteübersicht, aktualisiere während der Matches.</p>
            <ul className="bullet-list">
              <li>Messi +15 (Tor, Vorlage)</li>
              <li>Musiala +12 (Vorlage, Key Passes)</li>
              <li>Alisson +8 (weiße Weste)</li>
            </ul>
          </div>
          <div className="card">
            <h2>Form-Heatmap</h2>
            <p className="muted">Nutze die Heatmap als Reminder, wer zuletzt punktete.</p>
            <div className="pill-row">
              {topTeamCodes.map((code) => (
                <span key={code} className="pill">{flagForTeam(code)} {code}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KickbasePage;
