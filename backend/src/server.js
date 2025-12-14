import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let games = [
  {
    id: 1,
    teamA: 'Deutschland',
    teamB: 'Frankreich',
    date: new Date(Date.now() + 86400000).toISOString(),
    scoreA: null,
    scoreB: null,
    stadium: 'Olympiastadion Berlin',
    group: 'Gruppe A',
    stage: 'Gruppenphase',
  },
  {
    id: 2,
    teamA: 'Spanien',
    teamB: 'Brasilien',
    date: new Date(Date.now() + 172800000).toISOString(),
    scoreA: null,
    scoreB: null,
    stadium: 'Allianz Arena',
    group: 'Gruppe B',
    stage: 'Gruppenphase',
  },
  {
    id: 3,
    teamA: 'USA',
    teamB: 'Japan',
    date: new Date(Date.now() + 259200000).toISOString(),
    scoreA: null,
    scoreB: null,
    stadium: 'Signal Iduna Park',
    group: 'Gruppe C',
    stage: 'Gruppenphase',
  },
  {
    id: 4,
    teamA: 'England',
    teamB: 'Italien',
    date: new Date(Date.now() + 345600000).toISOString(),
    scoreA: null,
    scoreB: null,
    stadium: 'Veltins-Arena',
    group: 'Gruppe D',
    stage: 'Gruppenphase',
  },
  {
    id: 5,
    teamA: 'Nigeria',
    teamB: 'Mexiko',
    date: new Date(Date.now() + 432000000).toISOString(),
    scoreA: null,
    scoreB: null,
    stadium: 'Red Bull Arena Leipzig',
    group: 'Gruppe A',
    stage: 'Gruppenphase',
  },
  {
    id: 6,
    teamA: 'Australien',
    teamB: 'Kanada',
    date: new Date(Date.now() + 518400000).toISOString(),
    scoreA: null,
    scoreB: null,
    stadium: 'Volksparkstadion',
    group: 'Gruppe B',
    stage: 'Gruppenphase',
  },
];

const groups = [
  {
    name: 'Gruppe A',
    city: 'Berlin & Leipzig',
    teams: [
      { name: 'Deutschland', fifaRank: 2, coach: 'Julian Nagelsmann' },
      { name: 'Frankreich', fifaRank: 3, coach: 'Didier Deschamps' },
      { name: 'Nigeria', fifaRank: 24, coach: 'José Peseiro' },
      { name: 'Mexiko', fifaRank: 12, coach: 'Jaime Lozano' },
    ],
  },
  {
    name: 'Gruppe B',
    city: 'München & Hamburg',
    teams: [
      { name: 'Spanien', fifaRank: 8, coach: 'Luis de la Fuente' },
      { name: 'Brasilien', fifaRank: 4, coach: 'Dorival Júnior' },
      { name: 'Australien', fifaRank: 27, coach: 'Graham Arnold' },
      { name: 'Kanada', fifaRank: 49, coach: 'John Herdman' },
    ],
  },
  {
    name: 'Gruppe C',
    city: 'Dortmund',
    teams: [
      { name: 'USA', fifaRank: 11, coach: 'Gregg Berhalter' },
      { name: 'Japan', fifaRank: 19, coach: 'Hajime Moriyasu' },
      { name: 'Marokko', fifaRank: 13, coach: 'Walid Regragui' },
      { name: 'Serbien', fifaRank: 29, coach: 'Dragan Stojković' },
    ],
  },
  {
    name: 'Gruppe D',
    city: 'Gelsenkirchen',
    teams: [
      { name: 'England', fifaRank: 5, coach: 'Gareth Southgate' },
      { name: 'Italien', fifaRank: 9, coach: 'Luciano Spalletti' },
      { name: 'Schweiz', fifaRank: 16, coach: 'Murat Yakin' },
      { name: 'Uruguay', fifaRank: 10, coach: 'Marcelo Bielsa' },
    ],
  },
];

let tips = [];
let nextTipId = 1;

const calculatePoints = (tip, game) => {
  if (game.scoreA === null || game.scoreB === null) return 0;

  const exact = tip.tipA === game.scoreA && tip.tipB === game.scoreB;
  if (exact) return 3;

  const tipDiff = tip.tipA - tip.tipB;
  const gameDiff = game.scoreA - game.scoreB;

  const tipOutcome = tipDiff === 0 ? 'draw' : tipDiff > 0 ? 'winA' : 'winB';
  const gameOutcome = gameDiff === 0 ? 'draw' : gameDiff > 0 ? 'winA' : 'winB';

  return tipOutcome === gameOutcome ? 1 : 0;
};

const recalculatePoints = (gameId) => {
  const game = games.find((g) => g.id === gameId);
  if (!game) return;
  tips
    .filter((tip) => tip.gameId === gameId)
    .forEach((tip) => {
      tip.points = calculatePoints(tip, game);
    });
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/games', (req, res) => {
  res.json(games);
});

app.get('/api/groups', (req, res) => {
  const groupsWithGames = groups.map((group) => ({
    ...group,
    games: games.filter((game) => game.group === group.name),
  }));
  res.json(groupsWithGames);
});

app.post('/api/tips', (req, res) => {
  const { userName, gameId, tipA, tipB } = req.body;

  if (!userName || gameId === undefined || tipA === undefined || tipB === undefined) {
    return res.status(400).json({ error: 'userName, gameId, tipA and tipB are required' });
  }

  const game = games.find((g) => g.id === Number(gameId));
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const newTip = {
    id: nextTipId++,
    userName,
    gameId: game.id,
    tipA: Number(tipA),
    tipB: Number(tipB),
    points: calculatePoints({ tipA: Number(tipA), tipB: Number(tipB) }, game),
  };

  tips.push(newTip);
  res.status(201).json(newTip);
});

app.post('/api/games/:id/result', (req, res) => {
  const gameId = Number(req.params.id);
  const { scoreA, scoreB } = req.body;

  const game = games.find((g) => g.id === gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  if (scoreA === undefined || scoreB === undefined) {
    return res.status(400).json({ error: 'scoreA and scoreB are required' });
  }

  game.scoreA = Number(scoreA);
  game.scoreB = Number(scoreB);

  recalculatePoints(gameId);

  res.json(game);
});

app.get('/api/scoreboard', (req, res) => {
  const scoreboard = tips.reduce((acc, tip) => {
    if (!acc[tip.userName]) {
      acc[tip.userName] = { userName: tip.userName, points: 0 };
    }
    acc[tip.userName].points += tip.points;
    return acc;
  }, {});

  const result = Object.values(scoreboard).sort((a, b) => b.points - a.points);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
