# Kicktipp-Style Fullstack App

Eine einfache Fullstack-Web-App zum Tippen von Spielergebnissen ähnlich Kicktipp. Das Projekt besteht aus einem Node.js/Express-Backend und einer React/Vite-Frontend-App.

## Projektidee
- Spiele verwalten (in-memory) und Ergebnisse eintragen.
- Nutzer können Tipps abgeben.
- Rangliste zeigt Punkte basierend auf eingereichten Tipps und Ergebnissen.
- Turnier-Übersicht mit Gruppen, Stadien und Spielplan.

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
      TournamentPage.jsx
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
# Schnellstart (Root-Skripte, starten Backend & Frontend parallel)
npm install          # installiert npm-run-all im Root
npm run install:all  # installiert Backend + Frontend Abhängigkeiten
npm run dev          # Backend auf Port 4000, Frontend auf Port 5173

# Backend einzeln
cd backend
npm install
npm run dev   # Start mit nodemon
# oder
npm start     # Normaler Start

# alternativ aus dem Projekt-Root nur fürs Backend
npm run install:backend
npm run dev:backend
```

### API-Endpunkte
- `GET /api/health` → einfacher Health-Check.
- `GET /api/games` → Liste aller Spiele.
- `GET /api/groups` → Gruppen mit Teams, Stadien und zugehörigen Gruppenspielen.
- `POST /api/tips` → Tipp speichern. Body: `{ userName, gameId, tipA, tipB }`.
- `POST /api/games/:id/result` → Spielergebnis setzen. Body: `{ scoreA, scoreB }`.
- `GET /api/scoreboard` → Rangliste aller Nutzer.

## Frontend
- React + Vite + React Router.
- Läuft standardmäßig auf Port **5173** und nutzt das Backend unter `http://localhost:4000`.

### Starten
```bash
# bevorzugt aus dem Frontend-Ordner
cd frontend
npm install
npm run dev    # startet Vite Dev Server
# für Produktion
npm run build
npm run preview

# alternativ aus dem Projekt-Root (falls du dort schon npm install ausgeführt hast)
npm run install:frontend
npm run dev:frontend
```

### Seiten
- `/tournament` → WM-Gruppen, Stadien und Spielplan pro Gruppe.
- `/games` → Spiele-Liste, Eingabe von Tipps je Spiel.
- `/scoreboard` → Rangliste mit Gesamtpunkten.

## Konfliktfreien Stand holen / neuen Branch starten
Falls beim Mergen Konflikte auftreten, kannst du einfach einen frischen Branch auf Basis dieses Stands anlegen, statt alte lokale Änderungen zu mergen:
```bash
git checkout work
# optional: lokalen Stand zurücksetzen, falls nötig
# git reset --hard
# neuen Branch anlegen
git checkout -b clean-worldcup
```
Danach wie oben beschrieben Backend und Frontend installieren/starten. So erhältst du einen konfliktfreien Zustand ohne bestehende lokale Änderungen.

## So startest du das komplette Projekt
1. Backend starten (`npm run dev` im Ordner `backend` **oder** `npm run dev:backend` im Projekt-Root). Server läuft auf **http://localhost:4000**.
2. Frontend starten (`npm run dev` im Ordner `frontend` **oder** `npm run dev:frontend` im Projekt-Root). Frontend läuft auf **http://localhost:5173**.
3. Über `/tournament` Gruppen & Spielplan checken, über `/games` Tipps abgeben, über `/scoreboard` Punkte einsehen.
