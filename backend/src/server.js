import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const baseKickoff = (offsetDays, hour = 19) => {
  const kickoff = new Date(Date.UTC(2026, 5, 12, hour, 0, 0));
  kickoff.setUTCDate(kickoff.getUTCDate() + offsetDays);
  return kickoff.toISOString();
};

const teams = [
  { code: 'USA', name: 'USA', flag: '🇺🇸', confed: 'CONCACAF', ranking: 11, groupId: 'A', storyline: 'Gastgeber in Nordamerika' },
  { code: 'MEX', name: 'Mexiko', flag: '🇲🇽', confed: 'CONCACAF', ranking: 15, groupId: 'A', storyline: 'Co-Gastgeber mit Heimvorteil in Mexiko-Stadt' },
  { code: 'CAN', name: 'Kanada', flag: '🇨🇦', confed: 'CONCACAF', ranking: 45, groupId: 'A', storyline: 'Gastgeber mit junger Generation um David' },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', confed: 'UEFA', ranking: 9, groupId: 'A', storyline: 'Ronaldo-Nachfolger wollen glänzen' },

  { code: 'BRA', name: 'Brasilien', flag: '🇧🇷', confed: 'CONMEBOL', ranking: 3, groupId: 'B', storyline: 'Hexa-Jagd mit neuer Offensive' },
  { code: 'ARG', name: 'Argentinien', flag: '🇦🇷', confed: 'CONMEBOL', ranking: 1, groupId: 'B', storyline: 'Titelverteidiger mit Topstars' },
  { code: 'COL', name: 'Kolumbien', flag: '🇨🇴', confed: 'CONMEBOL', ranking: 14, groupId: 'B', storyline: 'Starke Copa-Form mit Díaz' },
  { code: 'ECU', name: 'Ecuador', flag: '🇪🇨', confed: 'CONMEBOL', ranking: 31, groupId: 'B', storyline: 'Tempo-Team aus den Anden' },

  { code: 'GER', name: 'Deutschland', flag: '🇩🇪', confed: 'UEFA', ranking: 12, groupId: 'C', storyline: 'Dritte WM im Concacaf-Raum' },
  { code: 'ENG', name: 'England', flag: '🏴', confed: 'UEFA', ranking: 4, groupId: 'C', storyline: 'Golden Generation mit Kane/Nachfolge' },
  { code: 'NED', name: 'Niederlande', flag: '🇳🇱', confed: 'UEFA', ranking: 8, groupId: 'C', storyline: 'Taktik-Füchse aus Europa' },
  { code: 'DEN', name: 'Dänemark', flag: '🇩🇰', confed: 'UEFA', ranking: 19, groupId: 'C', storyline: 'Eriksen-Ära 2.0' },

  { code: 'FRA', name: 'Frankreich', flag: '🇫🇷', confed: 'UEFA', ranking: 2, groupId: 'D', storyline: 'Mbappé will die Krone zurück' },
  { code: 'ESP', name: 'Spanien', flag: '🇪🇸', confed: 'UEFA', ranking: 7, groupId: 'D', storyline: 'Jugend forscht mit Pedri & Gavi' },
  { code: 'ITA', name: 'Italien', flag: '🇮🇹', confed: 'UEFA', ranking: 13, groupId: 'D', storyline: 'Rückkehr zur WM-Bühne' },
  { code: 'SUI', name: 'Schweiz', flag: '🇨🇭', confed: 'UEFA', ranking: 16, groupId: 'D', storyline: 'Stabile Turniermannschaft' },

  { code: 'BEL', name: 'Belgien', flag: '🇧🇪', confed: 'UEFA', ranking: 5, groupId: 'E', storyline: 'Letzter Lauf der goldenen Generation' },
  { code: 'CRO', name: 'Kroatien', flag: '🇭🇷', confed: 'UEFA', ranking: 6, groupId: 'E', storyline: 'Routine und Kampfgeist' },
  { code: 'MAR', name: 'Marokko', flag: '🇲🇦', confed: 'CAF', ranking: 10, groupId: 'E', storyline: 'Halbfinal-Held:innen von 2022' },
  { code: 'TUR', name: 'Türkei', flag: '🇹🇷', confed: 'UEFA', ranking: 38, groupId: 'E', storyline: 'Feurige Fans auch in Nordamerika' },

  { code: 'JPN', name: 'Japan', flag: '🇯🇵', confed: 'AFC', ranking: 20, groupId: 'F', storyline: 'Technik und Pressing' },
  { code: 'KOR', name: 'Südkorea', flag: '🇰🇷', confed: 'AFC', ranking: 22, groupId: 'F', storyline: 'Son & Co. on Tour' },
  { code: 'AUS', name: 'Australien', flag: '🇦🇺', confed: 'AFC', ranking: 27, groupId: 'F', storyline: 'Physisch starkes Team' },
  { code: 'IRN', name: 'Iran', flag: '🇮🇷', confed: 'AFC', ranking: 21, groupId: 'F', storyline: 'Defensiv kompakt' },

  { code: 'NGA', name: 'Nigeria', flag: '🇳🇬', confed: 'CAF', ranking: 32, groupId: 'G', storyline: 'Tempo-Flügel und Talent' },
  { code: 'SEN', name: 'Senegal', flag: '🇸🇳', confed: 'CAF', ranking: 18, groupId: 'G', storyline: 'AFCON-Champions mit Starpower' },
  { code: 'GHA', name: 'Ghana', flag: '🇬🇭', confed: 'CAF', ranking: 60, groupId: 'G', storyline: 'Junge Truppe mit Kudus' },
  { code: 'EGY', name: 'Ägypten', flag: '🇪🇬', confed: 'CAF', ranking: 36, groupId: 'G', storyline: 'Salahs vielleicht letzte WM' },

  { code: 'URU', name: 'Uruguay', flag: '🇺🇾', confed: 'CONMEBOL', ranking: 17, groupId: 'H', storyline: 'Valverde-Generation übernimmt' },
  { code: 'CHI', name: 'Chile', flag: '🇨🇱', confed: 'CONMEBOL', ranking: 28, groupId: 'H', storyline: 'Neustart mit Nachwuchs' },
  { code: 'POL', name: 'Polen', flag: '🇵🇱', confed: 'UEFA', ranking: 26, groupId: 'H', storyline: 'Lewandowski-Nachfolger im Fokus' },
  { code: 'SWE', name: 'Schweden', flag: '🇸🇪', confed: 'UEFA', ranking: 23, groupId: 'H', storyline: 'Kompakt und effizient' },
];

const teamMap = new Map(teams.map((team) => [team.code, team]));

const groups = [
  { id: 'A', name: 'Nordamerika-Eröffnung', teamCodes: ['USA', 'MEX', 'CAN', 'POR'] },
  { id: 'B', name: 'Südamerika-Feuer', teamCodes: ['BRA', 'ARG', 'COL', 'ECU'] },
  { id: 'C', name: 'Europäische Klassiker', teamCodes: ['GER', 'ENG', 'NED', 'DEN'] },
  { id: 'D', name: 'Kontinentale Champions', teamCodes: ['FRA', 'ESP', 'ITA', 'SUI'] },
  { id: 'E', name: 'Formstarke Herausforderer', teamCodes: ['BEL', 'CRO', 'MAR', 'TUR'] },
  { id: 'F', name: 'AFC-Power', teamCodes: ['JPN', 'KOR', 'AUS', 'IRN'] },
  { id: 'G', name: 'Afrikanische Energie', teamCodes: ['NGA', 'SEN', 'GHA', 'EGY'] },
  { id: 'H', name: 'Südamerika & Europa Mix', teamCodes: ['URU', 'CHI', 'POL', 'SWE'] },
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

let matches = [
  createMatch(1, 'A', 'USA', 'POR', baseKickoff(0, 19), 'MetLife Stadium, New York'),
  createMatch(2, 'A', 'MEX', 'CAN', baseKickoff(1, 16), 'Estadio Azteca, Mexiko-Stadt'),
  createMatch(3, 'B', 'BRA', 'ECU', baseKickoff(1, 19), 'Levi’s Stadium, Santa Clara'),
  createMatch(4, 'B', 'ARG', 'COL', baseKickoff(1, 21), 'SoFi Stadium, Los Angeles'),
  createMatch(5, 'C', 'GER', 'DEN', baseKickoff(2, 15), 'BC Place, Vancouver'),
  createMatch(6, 'C', 'ENG', 'NED', baseKickoff(2, 19), 'AT&T Stadium, Arlington'),
  createMatch(7, 'D', 'FRA', 'SUI', baseKickoff(3, 16), 'NRG Stadium, Houston'),
  createMatch(8, 'D', 'ESP', 'ITA', baseKickoff(3, 19), 'Mercedes-Benz Stadium, Atlanta'),
  createMatch(9, 'E', 'BEL', 'TUR', baseKickoff(4, 15), 'Hard Rock Stadium, Miami'),
  createMatch(10, 'E', 'CRO', 'MAR', baseKickoff(4, 19), 'Soldier Field, Chicago'),
  createMatch(11, 'F', 'JPN', 'IRN', baseKickoff(5, 14), 'BMO Field, Toronto'),
  createMatch(12, 'F', 'KOR', 'AUS', baseKickoff(5, 17), 'Lumen Field, Seattle'),
  createMatch(13, 'G', 'NGA', 'EGY', baseKickoff(6, 15), 'Arrowhead Stadium, Kansas City'),
  createMatch(14, 'G', 'SEN', 'GHA', baseKickoff(6, 19), 'Lincoln Financial Field, Philadelphia'),
  createMatch(15, 'H', 'URU', 'POL', baseKickoff(7, 15), 'Copa America Stadium, Phoenix'),
  createMatch(16, 'H', 'SWE', 'CHI', baseKickoff(7, 19), 'Gillette Stadium, Boston'),
];

let tips = [];
let nextTipId = 1;
let championTips = [];
let nextChampionTipId = 1;
const championCutoff = new Date('2026-06-12T00:00:00Z');
let championWinnerCode = null; // set to the actual winner when known
const championPoints = 10;
const dataVersion = 'wm-2026-v1';

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

const recalculatePoints = (matchId) => {
  const match = matches.find((g) => g.id === matchId);
  if (!match) return;

  tips
    .filter((tip) => tip.matchId === matchId)
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
    userName,
    matchId: match.id,
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
  const matchId = Number(req.params.id);
  const { scoreA, scoreB } = req.body;

  const match = matches.find((g) => g.id === matchId);
  if (!match) {
    return res.status(404).json({ error: 'Game not found' });
  }

  if (scoreA === undefined || scoreB === undefined) {
    return res.status(400).json({ error: 'scoreA and scoreB are required' });
  }

  match.scoreA = Number(scoreA);
  match.scoreB = Number(scoreB);

  recalculatePoints(matchId);

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
