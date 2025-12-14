import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());


const baseKickoff = (offsetDays, hour = 18) => {

  const kickoff = new Date(Date.UTC(2026, 5, 12, hour, 0, 0));
  kickoff.setUTCDate(kickoff.getUTCDate() + offsetDays);
  return kickoff.toISOString();
};

const venues = [
  'MetLife Stadium (East Rutherford)',
  'SoFi Stadium (Los Angeles)',
  'AT&T Stadium (Arlington)',
  'Arrowhead Stadium (Kansas City)',
  'Lumen Field (Seattle)',
  "Levi's Stadium (Santa Clara)",
  'Mercedes-Benz Stadium (Atlanta)',
  'Hard Rock Stadium (Miami)',
  'NRG Stadium (Houston)',
  'Gillette Stadium (Foxborough)',
  'BC Place (Vancouver)',
  'BMO Field (Toronto)',
  'Estadio Azteca (Mexiko-Stadt)',
  'Estadio Akron (Guadalajara)',
  'Estadio BBVA (Monterrey)',
  'Camping World Stadium (Orlando)',
  'Lincoln Financial Field (Philadelphia)',
  'Soldier Field (Chicago)',
  'State Farm Stadium (Phoenix)',
  'Estadio Olímpico Universitario (Mexiko-Stadt)',

];

let venueIndex = 0;
const nextVenue = () => {
  const venue = venues[venueIndex % venues.length];
  venueIndex += 1;
  return venue;
};

const teams = [
  { code: 'USA', name: 'USA', flag: '🇺🇸', confed: 'CONCACAF', ranking: 11, groupId: 'A', storyline: 'Gastgeber-Stolz und Heimvorteil quer durch die Staaten.' },
  { code: 'MEX', name: 'Mexiko', flag: '🇲🇽', confed: 'CONCACAF', ranking: 15, groupId: 'A', storyline: 'Co-Gastgeber mit Azteken-Magie und voller Stadien.' },
  { code: 'CAN', name: 'Kanada', flag: '🇨🇦', confed: 'CONCACAF', ranking: 45, groupId: 'A', storyline: 'Heimturnier für Davies & Co. in Vancouver und Toronto.' },
  { code: 'CRC', name: 'Costa Rica', flag: '🇨🇷', confed: 'CONCACAF', ranking: 42, groupId: 'A', storyline: 'Turnier-Experten mit defensivem Bollwerk.' },

  { code: 'ARG', name: 'Argentinien', flag: '🇦🇷', confed: 'CONMEBOL', ranking: 1, groupId: 'B', storyline: 'Titelverteidiger mit neuer Generation um Julián Álvarez.' },
  { code: 'PER', name: 'Peru', flag: '🇵🇪', confed: 'CONMEBOL', ranking: 22, groupId: 'B', storyline: 'Kompakte Einheit mit lautstarken Fans.' },
  { code: 'UKR', name: 'Ukraine', flag: '🇺🇦', confed: 'UEFA', ranking: 24, groupId: 'B', storyline: 'Großer Teamgeist und Tempo auf den Flügeln.' },
  { code: 'NZL', name: 'Neuseeland', flag: '🇳🇿', confed: 'OFC', ranking: 103, groupId: 'B', storyline: 'Ozeanien-Champion mit Außenseiterchancen.' },

  { code: 'BRA', name: 'Brasilien', flag: '🇧🇷', confed: 'CONMEBOL', ranking: 3, groupId: 'C', storyline: 'Junge Selecao auf der Jagd nach Stern Nummer 6.' },
  { code: 'COL', name: 'Kolumbien', flag: '🇨🇴', confed: 'CONMEBOL', ranking: 14, groupId: 'C', storyline: 'Copa-Formstark mit Díaz als Leitfigur.' },
  { code: 'JPN', name: 'Japan', flag: '🇯🇵', confed: 'AFC', ranking: 20, groupId: 'C', storyline: 'Strukturiertes Pressing und Präzision im Passspiel.' },
  { code: 'TUR', name: 'Türkei', flag: '🇹🇷', confed: 'UEFA', ranking: 38, groupId: 'C', storyline: 'Leidenschaftliche Fans, talentierter Kader.' },

  { code: 'FRA', name: 'Frankreich', flag: '🇫🇷', confed: 'UEFA', ranking: 2, groupId: 'D', storyline: 'Mbappé und Co. wollen den Pokal zurück.' },
  { code: 'SUI', name: 'Schweiz', flag: '🇨🇭', confed: 'UEFA', ranking: 16, groupId: 'D', storyline: 'Stabile Turniermannschaft mit viel Erfahrung.' },
  { code: 'MLI', name: 'Mali', flag: '🇲🇱', confed: 'CAF', ranking: 47, groupId: 'D', storyline: 'Junges, physisches Team mit Offensivdrang.' },
  { code: 'QAT', name: 'Katar', flag: '🇶🇦', confed: 'AFC', ranking: 58, groupId: 'D', storyline: 'Asienmeister von 2023 will überraschen.' },

  { code: 'ENG', name: 'England', flag: '🏴', confed: 'UEFA', ranking: 4, groupId: 'E', storyline: 'Kane-Nachfolge mit vielen Premier-League-Stars.' },
  { code: 'SEN', name: 'Senegal', flag: '🇸🇳', confed: 'CAF', ranking: 18, groupId: 'E', storyline: 'AFCON-Champions mit Tempo und Physis.' },
  { code: 'AUS', name: 'Australien', flag: '🇦🇺', confed: 'AFC', ranking: 27, groupId: 'E', storyline: 'Robuste Socceroos mit WM-Routine.' },
  { code: 'HON', name: 'Honduras', flag: '🇭🇳', confed: 'CONCACAF', ranking: 80, groupId: 'E', storyline: 'Rückkehr auf die große Bühne mit Kampfgeist.' },

  { code: 'ESP', name: 'Spanien', flag: '🇪🇸', confed: 'UEFA', ranking: 7, groupId: 'F', storyline: 'Jugend forscht mit Pedri, Gavi und viel Ballbesitz.' },
  { code: 'NGA', name: 'Nigeria', flag: '🇳🇬', confed: 'CAF', ranking: 32, groupId: 'F', storyline: 'Flügeltempo und Torjäger-Power.' },
  { code: 'KSA', name: 'Saudi-Arabien', flag: '🇸🇦', confed: 'AFC', ranking: 54, groupId: 'F', storyline: 'Disziplinierte Defensive und gefährliche Konter.' },
  { code: 'SRB', name: 'Serbien', flag: '🇷🇸', confed: 'UEFA', ranking: 29, groupId: 'F', storyline: 'Torgefahr durch körperliche Stürmer.' },

  { code: 'GER', name: 'Deutschland', flag: '🇩🇪', confed: 'UEFA', ranking: 12, groupId: 'G', storyline: 'Nagelsmann-Ära will in Nordamerika glänzen.' },
  { code: 'MAR', name: 'Marokko', flag: '🇲🇦', confed: 'CAF', ranking: 10, groupId: 'G', storyline: 'Halbfinal-Helden von 2022 bringen Stabilität.' },
  { code: 'ECU', name: 'Ecuador', flag: '🇪🇨', confed: 'CONMEBOL', ranking: 31, groupId: 'G', storyline: 'Junge Mannschaft mit viel Intensität.' },
  { code: 'JAM', name: 'Jamaika', flag: '🇯🇲', confed: 'CONCACAF', ranking: 57, groupId: 'G', storyline: 'Reggae Boyz mit Premier-League-Power.' },

  { code: 'POR', name: 'Portugal', flag: '🇵🇹', confed: 'UEFA', ranking: 9, groupId: 'H', storyline: 'Post-Ronaldo-Generation mit viel Kreativität.' },
  { code: 'TUN', name: 'Tunesien', flag: '🇹🇳', confed: 'CAF', ranking: 41, groupId: 'H', storyline: 'Defensiv stark, gefährlich bei Standards.' },
  { code: 'KOR', name: 'Südkorea', flag: '🇰🇷', confed: 'AFC', ranking: 22, groupId: 'H', storyline: 'Son & Co. mit hohem Pressing.' },
  { code: 'PAN', name: 'Panama', flag: '🇵🇦', confed: 'CONCACAF', ranking: 44, groupId: 'H', storyline: 'Gold-Cup-Finalist mit klarer Struktur.' },

  { code: 'NED', name: 'Niederlande', flag: '🇳🇱', confed: 'UEFA', ranking: 8, groupId: 'I', storyline: 'Taktisch stark mit Van Dijk als Abwehrchef.' },
  { code: 'ALG', name: 'Algerien', flag: '🇩🇿', confed: 'CAF', ranking: 43, groupId: 'I', storyline: 'Riyad Mahrez führt ein erfahrenes Team.' },
  { code: 'IRN', name: 'Iran', flag: '🇮🇷', confed: 'AFC', ranking: 21, groupId: 'I', storyline: 'Solide Defensive, clevere Konter.' },
  { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', confed: 'CONMEBOL', ranking: 49, groupId: 'I', storyline: 'Kompakte Defensive mit Biss.' },

  { code: 'BEL', name: 'Belgien', flag: '🇧🇪', confed: 'UEFA', ranking: 5, groupId: 'J', storyline: 'Neue Generation will den Umbruch nutzen.' },
  { code: 'EGY', name: 'Ägypten', flag: '🇪🇬', confed: 'CAF', ranking: 36, groupId: 'J', storyline: 'Salahs (vielleicht) letzte WM.' },
  { code: 'UZB', name: 'Usbekistan', flag: '🇺🇿', confed: 'AFC', ranking: 67, groupId: 'J', storyline: 'Asiens aufstrebendes Team mit viel Tempo.' },
  { code: 'GHA', name: 'Ghana', flag: '🇬🇭', confed: 'CAF', ranking: 60, groupId: 'J', storyline: 'Junge Black Stars mit Kudus als Leader.' },

  { code: 'ITA', name: 'Italien', flag: '🇮🇹', confed: 'UEFA', ranking: 13, groupId: 'K', storyline: 'Rückkehr auf die WM-Bühne mit neuer Defensive.' },
  { code: 'URU', name: 'Uruguay', flag: '🇺🇾', confed: 'CONMEBOL', ranking: 17, groupId: 'K', storyline: 'Valverde-Generation übernimmt das Zepter.' },
  { code: 'CMR', name: 'Kamerun', flag: '🇨🇲', confed: 'CAF', ranking: 50, groupId: 'K', storyline: 'Unbezähmbare Löwen mit physischer Präsenz.' },
  { code: 'IRQ', name: 'Irak', flag: '🇮🇶', confed: 'AFC', ranking: 59, groupId: 'K', storyline: 'Gutes Mittelfeld, starke Fans.' },

  { code: 'CRO', name: 'Kroatien', flag: '🇭🇷', confed: 'UEFA', ranking: 6, groupId: 'L', storyline: 'Routine und Modrić-Genie im Mittelfeld.' },
  { code: 'SWE', name: 'Schweden', flag: '🇸🇪', confed: 'UEFA', ranking: 23, groupId: 'L', storyline: 'Disziplinierte Defensive, gefährliche Standards.' },
  { code: 'CIV', name: "Elfenbeinküste", flag: '🇨🇮', confed: 'CAF', ranking: 51, groupId: 'L', storyline: 'Afrikameister mit Power-Offensive.' },
  { code: 'CHI', name: 'Chile', flag: '🇨🇱', confed: 'CONMEBOL', ranking: 28, groupId: 'L', storyline: 'Neustart mit hungriger Generation.' },
];

const teamMap = new Map(teams.map((team) => [team.code, team]));

const groups = [
  { id: 'A', name: 'Nordamerika-Start', teamCodes: ['USA', 'MEX', 'CAN', 'CRC'] },
  { id: 'B', name: 'Südamerika & Freunde', teamCodes: ['ARG', 'PER', 'UKR', 'NZL'] },
  { id: 'C', name: 'Samba & Samurai', teamCodes: ['BRA', 'COL', 'JPN', 'TUR'] },
  { id: 'D', name: 'Europa trifft Asien/Afrika', teamCodes: ['FRA', 'SUI', 'MLI', 'QAT'] },
  { id: 'E', name: 'Tradition & Überraschung', teamCodes: ['ENG', 'SEN', 'AUS', 'HON'] },
  { id: 'F', name: 'Ballbesitz & Power', teamCodes: ['ESP', 'NGA', 'KSA', 'SRB'] },
  { id: 'G', name: 'Kontinentale Mischung', teamCodes: ['GER', 'MAR', 'ECU', 'JAM'] },
  { id: 'H', name: 'Atlantik-Linie', teamCodes: ['POR', 'TUN', 'KOR', 'PAN'] },
  { id: 'I', name: 'Taktik & Temperament', teamCodes: ['NED', 'ALG', 'IRN', 'PAR'] },
  { id: 'J', name: 'Umbruch & Außenseiter', teamCodes: ['BEL', 'EGY', 'UZB', 'GHA'] },
  { id: 'K', name: 'Rekorde & Revivals', teamCodes: ['ITA', 'URU', 'CMR', 'IRQ'] },
  { id: 'L', name: 'Routine & Dynamik', teamCodes: ['CRO', 'SWE', 'CIV', 'CHI'] },
];

const createMatch = (id, groupId, teamACode, teamBCode, kickoff, venue) => ({
  id,
  groupId,
  teamACode,
  teamBCode,
  kickoff,
  venue,
  scoreA: null,
  scoreB: null,
});

let matchId = 1;
let matches = [];

const scheduleGroup = (group, startDay = 0) => {
  const [t1, t2, t3, t4] = group.teamCodes;
  const slots = [
    [t1, t2, startDay, 18],
    [t3, t4, startDay, 21],
    [t1, t3, startDay + 3, 18],
    [t2, t4, startDay + 3, 21],
    [t1, t4, startDay + 6, 18],
    [t2, t3, startDay + 6, 21],
  ];

  slots.forEach(([home, away, offset, hour]) => {
    matches.push(createMatch(matchId++, group.id, home, away, baseKickoff(offset, hour), nextVenue()));
  });
};

groups.forEach((group, index) => {
  scheduleGroup(group, index * 2);
});

let tips = [];
let nextTipId = 1;
let championTips = [];
let nextChampionTipId = 1;
const championCutoff = new Date('2026-06-12T00:00:00Z');
let championWinnerCode = null; // set to the actual winner when known
const championPoints = 10;
const dataVersion = 'wm-2026-v2';

const matchOutcome = (scoreA, scoreB) => {
  if (scoreA === scoreB) return 'draw';
  return scoreA > scoreB ? 'winA' : 'winB';
};

const calculatePoints = (tip, match) => {
  if (match.scoreA === null || match.scoreB === null) {
    return { points: 0, exact: false, tendency: false };
  }

  const exact = tip.tipA === match.scoreA && tip.tipB === match.scoreB;
  if (exact) {
    return { points: 3, exact: true, tendency: true };
  }

  const tipOutcome = matchOutcome(tip.tipA, tip.tipB);
  const gameOutcome = matchOutcome(match.scoreA, match.scoreB);
  const tendency = tipOutcome === gameOutcome;

  return { points: tendency ? 1 : 0, exact: false, tendency };
};


const recalculatePoints = (matchIdParam) => {
  const match = matches.find((g) => g.id === matchIdParam);
  if (!match) return;

  tips
    .filter((tip) => tip.matchId === matchIdParam)

    .forEach((tip) => {
      const { points, exact, tendency } = calculatePoints(tip, match);
      tip.points = points;
      tip.exact = exact;
      tip.tendency = tendency;
    });
};

const isLocked = (match) => new Date(match.kickoff) <= new Date();

const buildStandings = (group) => {
  const groupMatches = matches.filter((m) => m.groupId === group.id);

  const table = group.teamCodes.map((code) => {
    const team = teamMap.get(code);
    return {
      teamCode: code,
      team: team?.name || code,
      flag: team?.flag,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    };
  });

  const rowFor = (code) => table.find((r) => r.teamCode === code);

  groupMatches.forEach((match) => {
    if (match.scoreA === null || match.scoreB === null) return;


    const rowA = rowFor(match.teamACode);
    const rowB = rowFor(match.teamBCode);

    if (!rowA || !rowB) return;

    rowA.played += 1;
    rowB.played += 1;

    rowA.goalsFor += match.scoreA;
    rowA.goalsAgainst += match.scoreB;
    rowB.goalsFor += match.scoreB;
    rowB.goalsAgainst += match.scoreA;

    const outcome = matchOutcome(match.scoreA, match.scoreB);
    if (outcome === 'draw') {
      rowA.draws += 1;
      rowB.draws += 1;
      rowA.points += 1;
      rowB.points += 1;
    } else if (outcome === 'winA') {
      rowA.wins += 1;
      rowB.losses += 1;
      rowA.points += 3;
    } else {
      rowB.wins += 1;
      rowA.losses += 1;
      rowB.points += 3;
    }
  });

  table.forEach((row) => {
    row.goalDiff = row.goalsFor - row.goalsAgainst;
  });

  const sorted = table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return b.goalsFor - a.goalsFor;
  });

  return sorted.map((row, index) => ({ ...row, rank: index + 1 }));
};


const mapMatch = (match) => {
  const teamA = teamMap.get(match.teamACode);
  const teamB = teamMap.get(match.teamBCode);
  return {
    ...match,
    teamA: teamA?.name || match.teamACode,
    teamB: teamB?.name || match.teamBCode,
    teamACode: match.teamACode,
    teamBCode: match.teamBCode,
    teamAFlag: teamA?.flag,
    teamBFlag: teamB?.flag,
    isLocked: isLocked(match),
  };
};

const mapGroup = (group) => {
  const fixtures = matches.filter((m) => m.groupId === group.id).map(mapMatch);
  const standings = buildStandings(group);
  return {
    ...group,
    teams: group.teamCodes.map((code) => teamMap.get(code)).filter(Boolean),
    standings,
    fixtures,
  };
};

const championState = () => ({
  locked: new Date() >= championCutoff,
  winnerCode: championWinnerCode,
});


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});


app.get('/api/version', (req, res) => {
  res.json({ version: dataVersion });

});

app.get('/api/matches', (req, res) => {
  res.json(matches.map(mapMatch));
});

app.get('/api/games', (req, res) => {
  res.json(matches.map(mapMatch));
});

app.get('/api/groups', (req, res) => {
<
  const result = groups.map(mapGroup);
  res.json(result);
});

app.get('/api/teams', (req, res) => {
  const enriched = teams.map((team) => ({
    ...team,
    groupName: groups.find((g) => g.id === team.groupId)?.name,
  }));
  res.json(enriched);
});

app.get('/api/teams/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const team = teamMap.get(code);
  if (!team) {
    return res.status(404).json({ error: 'Team nicht gefunden.' });
  }

  const group = groups.find((g) => g.id === team.groupId);
  const fixtures = matches
    .filter((m) => m.teamACode === code || m.teamBCode === code)
    .map(mapMatch)
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff));

  res.json({
    ...team,
    groupName: group?.name,
    fixtures,
  });

});

app.post('/api/tips', (req, res) => {
  const { userName, gameId, matchId, tipA, tipB } = req.body;
  const id = matchId ?? gameId;

  if (!userName || id === undefined || tipA === undefined || tipB === undefined) {
    return res.status(400).json({ error: 'userName, matchId/gameId, tipA und tipB sind Pflichtfelder.' });
  }

  const match = matches.find((g) => g.id === Number(id));
  if (!match) {
    return res.status(404).json({ error: 'Spiel nicht gefunden.' });
  }

  if (isLocked(match)) {
    return res.status(400).json({ error: 'Tipps sind nach Anpfiff gesperrt.' });
  }

  const numericTipA = Number(tipA);
  const numericTipB = Number(tipB);
  if (Number.isNaN(numericTipA) || Number.isNaN(numericTipB)) {
    return res.status(400).json({ error: 'Tipps müssen Zahlen sein.' });
  }

  const existingTip = tips.find((t) => t.userName === userName && t.matchId === match.id);
  const { points, exact, tendency } = calculatePoints({ tipA: numericTipA, tipB: numericTipB }, match);

  if (existingTip) {
    existingTip.tipA = numericTipA;
    existingTip.tipB = numericTipB;
    existingTip.points = points;
    existingTip.exact = exact;
    existingTip.tendency = tendency;
    return res.json(existingTip);
  }

  const newTip = {
    id: nextTipId++,
    matchId: match.id,
    userName,

    tipA: numericTipA,
    tipB: numericTipB,
    points,
    exact,
    tendency,
  };

  tips.push(newTip);
  res.status(201).json(newTip);
});

app.post('/api/games/:id/result', (req, res) => {

  const matchIdParam = Number(req.params.id);
  const { scoreA, scoreB } = req.body;

  const match = matches.find((g) => g.id === matchIdParam);

  if (!match) {
    return res.status(404).json({ error: 'Game not found' });
  }

  if (scoreA === undefined || scoreB === undefined) {
    return res.status(400).json({ error: 'scoreA and scoreB are required' });
  }

  match.scoreA = Number(scoreA);
  match.scoreB = Number(scoreB);

  recalculatePoints(matchIdParam);

  res.json(mapMatch(match));
});

app.post('/api/bonus/champion', (req, res) => {
  const { userName, teamCode } = req.body;
  if (!userName || !teamCode) {
    return res.status(400).json({ error: 'userName und teamCode sind Pflichtfelder.' });
  }

  const code = teamCode.toUpperCase();
  const team = teamMap.get(code);
  if (!team) {
    return res.status(400).json({ error: 'Unbekanntes Team.' });
  }

  if (championState().locked) {
    return res.status(400).json({ error: 'Champion-Tipp ist gesperrt.' });
  }

  const existing = championTips.find((tip) => tip.userName === userName);
  if (existing) {
    existing.teamCode = code;
    return res.json({ ...existing, team });
  }

  const newTip = { id: nextChampionTipId++, userName, teamCode: code };
  championTips.push(newTip);
  res.status(201).json({ ...newTip, team });
});

app.get('/api/bonus/champion/:userName', (req, res) => {
  const { userName } = req.params;
  const tip = championTips.find((t) => t.userName === userName);
  if (!tip) {
    return res.json({ champion: null, locked: championState().locked });
  }

  const team = teamMap.get(tip.teamCode);
  res.json({ champion: { ...tip, team }, locked: championState().locked });
});

app.get('/api/bonus/champion', (req, res) => {
  const enriched = championTips.map((tip) => ({
    ...tip,
    team: teamMap.get(tip.teamCode),
  }));
  res.json({ picks: enriched, ...championState() });
});

app.get('/api/scoreboard', (req, res) => {
  const scoreboard = {};

  const ensureUser = (userName) => {
    if (!scoreboard[userName]) {
      scoreboard[userName] = {
        userName,
        points: 0,
        exact: 0,
        tendency: 0,
        bonusChampion: null,
        bonusChampionFlag: null,
        bonusChampionPoints: 0,
      };
    }
    return scoreboard[userName];
  };

  tips.forEach((tip) => {
    const entry = ensureUser(tip.userName);
    entry.points += tip.points;
    entry.exact += tip.exact ? 1 : 0;
    entry.tendency += tip.tendency ? 1 : 0;
  });

  championTips.forEach((tip) => {
    const entry = ensureUser(tip.userName);
    const team = teamMap.get(tip.teamCode);
    entry.bonusChampion = team?.name || tip.teamCode;
    entry.bonusChampionFlag = team?.flag;
    if (championWinnerCode && championWinnerCode === tip.teamCode) {
      entry.bonusChampionPoints = championPoints;
      entry.points += championPoints;
    }
  });

  const result = Object.values(scoreboard).sort((a, b) => b.points - a.points);
  res.json(result);
});

app.get('/api/tips/:userName', (req, res) => {
  const { userName } = req.params;
  const userTips = tips.filter((tip) => tip.userName === userName);
  res.json(userTips);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
