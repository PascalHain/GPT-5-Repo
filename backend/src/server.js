import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const groups = [
  {
    id: 'A',
    name: 'Gruppe A',
    teams: ['Deutschland', 'Spanien', 'Japan', 'Costa Rica'],
  },
  {
    id: 'B',
    name: 'Gruppe B',
    teams: ['Frankreich', 'Niederlande', 'Italien', 'Schweiz'],
  },
  {
    id: 'C',
    name: 'Gruppe C',
    teams: ['Brasilien', 'Argentinien', 'Uruguay', 'Kolumbien'],
  },
];

const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;

let matches = [
  {
    id: 1,
    groupId: 'A',
    teamA: 'Deutschland',
    teamB: 'Japan',
    kickoff: new Date(now + oneDay).toISOString(),
    venue: 'Berlin',
    scoreA: null,
    scoreB: null,
  },
  {
    id: 2,
    groupId: 'A',
    teamA: 'Spanien',
    teamB: 'Costa Rica',
    kickoff: new Date(now + oneDay * 1.5).toISOString(),
    venue: 'Hamburg',
    scoreA: null,
    scoreB: null,
  },
  {
    id: 3,
    groupId: 'A',
    teamA: 'Deutschland',
    teamB: 'Spanien',
    kickoff: new Date(now + oneDay * 2).toISOString(),
    venue: 'München',
    scoreA: null,
    scoreB: null,
  },
  {
    id: 4,
    groupId: 'B',
    teamA: 'Frankreich',
    teamB: 'Schweiz',
    kickoff: new Date(now + oneDay * 0.8).toISOString(),
    venue: 'Paris',
    scoreA: null,
    scoreB: null,
  },
  {
    id: 5,
    groupId: 'B',
    teamA: 'Niederlande',
    teamB: 'Italien',
    kickoff: new Date(now + oneDay * 1.4).toISOString(),
    venue: 'Amsterdam',
    scoreA: null,
    scoreB: null,
  },
  {
    id: 6,
    groupId: 'C',
    teamA: 'Brasilien',
    teamB: 'Kolumbien',
    kickoff: new Date(now + oneDay * 0.6).toISOString(),
    venue: 'Rio de Janeiro',
    scoreA: null,
    scoreB: null,
  },
  {
    id: 7,
    groupId: 'C',
    teamA: 'Argentinien',
    teamB: 'Uruguay',
    kickoff: new Date(now + oneDay * 1.2).toISOString(),
    venue: 'Buenos Aires',
    scoreA: null,
    scoreB: null,
  },
  {
    id: 8,
    groupId: 'C',
    teamA: 'Brasilien',
    teamB: 'Argentinien',
    kickoff: new Date(now + oneDay * 2.3).toISOString(),
    venue: 'São Paulo',
    scoreA: null,
    scoreB: null,
  },
];

let tips = [];
let nextTipId = 1;

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
  const table = group.teams.map((team) => ({
    team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
  }));

  const rowFor = (team) => table.find((r) => r.team === team);

  groupMatches.forEach((match) => {
    if (match.scoreA === null || match.scoreB === null) return;

    const rowA = rowFor(match.teamA);
    const rowB = rowFor(match.teamB);
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const mapMatch = (match) => ({
  ...match,
  isLocked: isLocked(match),
});

app.get('/api/matches', (req, res) => {
  res.json(matches.map(mapMatch));
});

app.get('/api/games', (req, res) => {
  res.json(matches.map(mapMatch));
});

app.get('/api/groups', (req, res) => {
  const result = groups.map((group) => {
    const fixtures = matches.filter((m) => m.groupId === group.id).map(mapMatch);
    const standings = buildStandings(group);
    return { ...group, standings, fixtures };
  });

  res.json(result);
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

app.get('/api/scoreboard', (req, res) => {
  const scoreboard = tips.reduce((acc, tip) => {
    if (!acc[tip.userName]) {
      acc[tip.userName] = { userName: tip.userName, points: 0, exact: 0, tendency: 0 };
    }
    acc[tip.userName].points += tip.points;
    acc[tip.userName].exact += tip.exact ? 1 : 0;
    acc[tip.userName].tendency += tip.tendency ? 1 : 0;
    return acc;
  }, {});

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
