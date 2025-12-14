# Kicktipp-Style Fullstack App

Eine einfache Fullstack-Web-App zum Tippen von Spielergebnissen ähnlich Kicktipp. Das Projekt besteht aus einem Node.js/Express-Backend und einer React/Vite-Frontend-App.

## Projektidee
- Spiele verwalten (in-memory) und Ergebnisse eintragen.
- Nutzer können Tipps abgeben und vor Anpfiff aktualisieren.
- Rangliste zeigt Punkte, exakte Treffer und richtige Tendenzen.
- Gruppenübersicht mit Tabelle und Fixture-Liste für die WM 2026 (Gruppen A–L, 48 Teams).
- Bonus-Tipp auf den Weltmeister mit Flaggen-Auswahl und Sperrfrist.
- Kickbase-inspirierte Aufstellungsseite mit zehn Top-Nationen (inkl. Deutschland), Dashboard-Switch zwischen Kicktipp &
  Kickbase, Team/News/Transfermarkt/Live-Punkte-Untertabs und ein 4-3-3 Pitch mit zufälligem 12er-Pool.

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
      DashboardPage.jsx
      GamesPage.jsx
      GroupOverviewPage.jsx
      KicktippPage.jsx
      ScoreboardPage.jsx
      KickbasePage.jsx
      TeamPage.jsx
  package.json
README.md
```

## Punkte-Regel
- **3 Punkte** für ein exakt getroffenes Ergebnis.
- **1 Punkt** für die richtige Tendenz (richtiger Sieger oder Unentschieden erkannt).
- **0 Punkte** sonst.

## Backend
- Node.js + Express, läuft auf Port **4000**.
- In-Memory-Daten (keine Datenbank) mit WM-2026-Gruppen (A–L), Flaggen und Storylines für 48 Teams inkl. aller Gastgeber.
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
- `GET /api/version` → gibt die aktuelle Datenversion für das Turnier zurück.
- `GET /api/matches` (Alias: `/api/games`) → Liste aller Spiele (inkl. Sperrstatus & Venue).
- `GET /api/groups` → Gruppenübersicht inkl. Tabelle (berechnet aus Ergebnissen) und Fixtures.
- `POST /api/tips` → Tipp speichern oder aktualisieren. Body: `{ userName, matchId, tipA, tipB }`. Gesperrt nach Anpfiff.
- `POST /api/games/:id/result` → Spielergebnis setzen. Body: `{ scoreA, scoreB }`.
- `GET /api/tips/:userName` → Alle Tipps eines Nutzers.
- `GET /api/teams` → Liste aller Teams mit Flaggen, Confed, Ranking und Gruppenzugehörigkeit.
- `GET /api/teams/:code` → Team-Detail mit Fixtures.
- `GET /api/scoreboard` → Rangliste aller Nutzer inkl. Exakt- und Tendenz-Zählern plus Champion-Bonus.
- `POST /api/bonus/champion` → Weltmeister-Tipp speichern. Body: `{ userName, teamCode }`. Gesperrt ab Turnierstart.
- `GET /api/bonus/champion/:userName` → Eigenen Champion-Tipp laden.

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
```

### Seiten
- `/dashboard` → Einstiegs-Dashboard mit Kacheln für Kicktipp und Kickbase.
- `/kicktipp` → Zentraler Kicktipp-Modus mit Tabs für Gruppen, Spielinfos (Briefing + Rangliste) und Tippen.
- `/games` → Spiele-Liste nach Gruppe, Eingabe und Laden von Tipps pro Spiel sowie Champion-Bonus-Tipp (innerhalb Kicktipp genutzt).
- `/groups` → WM-Gruppen mit Tabelle, Flaggen und Spielplan (innerhalb Kicktipp genutzt).
- `/scoreboard` → Rangliste mit Gesamtpunkten, exakten Tipps, Tendenzen und Champion-Bonus (innerhalb Kicktipp genutzt).
- `/teams/:code` → Team-Detail (Flagge, Kurzinfos, anstehende Spiele).
- `/kickbase` → Kickbase-Dashboard mit Unterreitern Team, News, Transfermarkt, Live-Punkte und einem 4-3-3 Pitch samt 12er-Pool.

## So startest du das komplette Projekt
1. Backend starten (`npm run dev` im Ordner `backend`). Server läuft auf **http://localhost:4000**.
2. Frontend starten (`npm run dev` im Ordner `frontend`). Frontend läuft auf **http://localhost:5173**.
3. Über `/games` Tipps abgeben, über `/groups` Spielplan und Tabellen checken, über `/scoreboard` Punkte einsehen.
