import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let games = [
  {
    id: 1,
    teamA: 'Team Alpha',
    teamB: 'Team Beta',
    date: new Date(Date.now() + 86400000).toISOString(),
    scoreA: null,
    scoreB: null,
  },
  {
    id: 2,
    teamA: 'Team Gamma',
    teamB: 'Team Delta',
    date: new Date(Date.now() + 172800000).toISOString(),
    scoreA: null,
    scoreB: null,
  },
  {
    id: 3,
    teamA: 'Team Epsilon',
    teamB: 'Team Zeta',
    date: new Date(Date.now() + 259200000).toISOString(),
    scoreA: null,
    scoreB: null,
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
