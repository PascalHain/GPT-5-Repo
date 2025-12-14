# Kicktipp-Style Fullstack App

Eine einfache Fullstack-Web-App zum Tippen von Spielergebnissen ähnlich Kicktipp. Das Projekt besteht aus einem Node.js/Express-Backend und einer React/Vite-Frontend-App.

## Projektidee
- Spiele verwalten (in-memory) und Ergebnisse eintragen.
- Nutzer können Tipps abgeben.
- Rangliste zeigt Punkte basierend auf eingereichten Tipps und Ergebnissen.

## Ordnerstruktur
```
backend/
  src/
    server.js
  package.json
frontend/
  src/
    main.jsx
    App.jsx
    pages/
      GamesPage.jsx
      ScoreboardPage.jsx
  package.json
README.md
```

## Punkte-Regel
- **3 Punkte** für ein exakt getroffenes Ergebnis.
- **1 Punkt** für die richtige Tendenz (richtiger Sieger oder Unentschieden erkannt).
- **0 Punkte** sonst.

## Backend
- Node.js + Express, läuft auf Port **4000**.
- In-Memory-Daten (keine Datenbank).
- CORS und JSON-Parsing aktiviert.

### Starten
```bash

cd backend
npm install
npm run dev   # Start mit nodemon
# oder
npm start     # Normaler Start

```

### API-Endpunkte
- `GET /api/health` → einfacher Health-Check.
- `GET /api/games` → Liste aller Spiele.
- `POST /api/tips` → Tipp speichern. Body: `{ userName, gameId, tipA, tipB }`.
- `POST /api/games/:id/result` → Spielergebnis setzen. Body: `{ scoreA, scoreB }`.
- `GET /api/scoreboard` → Rangliste aller Nutzer.

## Frontend
- React + Vite + React Router.
- Läuft standardmäßig auf Port **5173** und nutzt das Backend unter `http://localhost:4000`.

### Starten
```bash

cd frontend
npm install
npm run dev    # startet Vite Dev Server
# für Produktion
npm run build
npm run preview


### Seiten
- `/games` → Spiele-Liste, Eingabe von Tipps je Spiel.
- `/scoreboard` → Rangliste mit Gesamtpunkten.

## So startest du das komplette Projekt

3. Über `/games` Tipps abgeben, über `/scoreboard` Punkte einsehen.
