import { useEffect, useMemo, useState } from 'react';
import GroupOverviewPage from './GroupOverviewPage.jsx';
import GamesPage from './GamesPage.jsx';
import ScoreboardPage from './ScoreboardPage.jsx';

const tabConfig = [
  { id: 'groups', label: 'Gruppen' },
  { id: 'info', label: 'Spielinfos' },
  { id: 'tipps', label: 'Tippen' },
  { id: 'bracket', label: 'Turnierbaum' },
  { id: 'calendar', label: 'Kalender' },
];

const API_BASE = 'http://localhost:4000';

const bracketStages = [
  {
    id: 'round16',
    label: 'Achtelfinale',
    matches: [
      { id: 'r16-1', title: 'Sieger A vs Zweiter B', venue: 'MetLife Stadium, New York', time: '2026-07-04T18:00:00Z' },
      { id: 'r16-2', title: 'Sieger C vs Zweiter D', venue: 'SoFi Stadium, Los Angeles', time: '2026-07-04T21:00:00Z' },
      { id: 'r16-3', title: 'Sieger E vs Zweiter F', venue: 'Estadio Azteca, Mexiko-Stadt', time: '2026-07-05T18:00:00Z' },
      { id: 'r16-4', title: 'Sieger G vs Zweiter H', venue: 'NRG Stadium, Houston', time: '2026-07-05T21:00:00Z' },
      { id: 'r16-5', title: 'Sieger I vs Zweiter J', venue: 'Mercedes-Benz Stadium, Atlanta', time: '2026-07-06T18:00:00Z' },
      { id: 'r16-6', title: 'Sieger K vs Zweiter L', venue: 'Lumen Field, Seattle', time: '2026-07-06T21:00:00Z' },
      { id: 'r16-7', title: 'Bester Gruppendritte 1 vs Bester Gruppendritte 2', venue: 'BC Place, Vancouver', time: '2026-07-07T18:00:00Z' },
      { id: 'r16-8', title: 'Bester Gruppendritte 3 vs Bester Gruppendritte 4', venue: 'Hard Rock Stadium, Miami', time: '2026-07-07T21:00:00Z' },
    ],
  },
  {
    id: 'quarter',
    label: 'Viertelfinale',
    matches: [
      { id: 'qf-1', title: 'Sieger AF1 vs Sieger AF2', venue: 'AT&T Stadium, Dallas', time: '2026-07-10T19:00:00Z' },
      { id: 'qf-2', title: 'Sieger AF3 vs Sieger AF4', venue: 'MetLife Stadium, New York', time: '2026-07-11T19:00:00Z' },
      { id: 'qf-3', title: 'Sieger AF5 vs Sieger AF6', venue: 'SoFi Stadium, Los Angeles', time: '2026-07-12T19:00:00Z' },
      { id: 'qf-4', title: 'Sieger AF7 vs Sieger AF8', venue: 'Estadio Akron, Guadalajara', time: '2026-07-13T19:00:00Z' },
    ],
  },
  {
    id: 'semi',
    label: 'Halbfinale',
    matches: [
      { id: 'sf-1', title: 'Sieger VF1 vs Sieger VF2', venue: 'Mercedes-Benz Stadium, Atlanta', time: '2026-07-16T20:00:00Z' },
      { id: 'sf-2', title: 'Sieger VF3 vs Sieger VF4', venue: 'NRG Stadium, Houston', time: '2026-07-17T20:00:00Z' },
    ],
  },
  {
    id: 'final',
    label: 'Finale & 3. Platz',
    matches: [
      { id: 'bronze', title: 'Verlierer HF1 vs Verlierer HF2', venue: 'BC Place, Vancouver', time: '2026-07-19T18:00:00Z' },
      { id: 'final', title: 'Sieger HF1 vs Sieger HF2', venue: 'MetLife Stadium, New York', time: '2026-07-19T22:00:00Z' },
    ],
  },
];

function KicktippPage({ initialTab = 'groups' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [calendarMatches, setCalendarMatches] = useState([]);
  const [calendarStatus, setCalendarStatus] = useState('');
  const [calendarLoading, setCalendarLoading] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const fetchCalendarMatches = async () => {
    try {
      setCalendarLoading(true);
      const res = await fetch(`${API_BASE}/api/matches`);
      const data = await res.json();
      setCalendarMatches(data);
      setCalendarStatus('');
    } catch (error) {
      setCalendarStatus('Spielplan konnte nicht geladen werden.');
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarMatches();
  }, []);

  const calendarByDate = useMemo(() => {
    const grouped = calendarMatches.reduce((acc, match) => {
      const dayKey = new Date(match.kickoff).toISOString().split('T')[0];
      acc[dayKey] = acc[dayKey] ? [...acc[dayKey], match] : [match];
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, list]) => ({
        date,
        label: new Date(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }),
        matches: list.sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff)),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [calendarMatches]);

  return (
    <div className="stack-xl">
      <div className="mode-header">
        <div>
          <p className="eyebrow">Kicktipp</p>
          <h1>Gruppen, Infos, Tipps & Road to Final</h1>
          <p className="muted">Wechsle oben zwischen Übersicht, Storyline-Infos, Tippabgabe, Turnierbaum und Spielkalender.</p>
        </div>
        <div className="mode-tabs center">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'mode-tab active' : 'mode-tab'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'groups' && (
        <div className="card">
          <GroupOverviewPage />
        </div>
      )}

      {activeTab === 'info' && (
        <div className="grid-2">
          <div className="card">
            <h2>Matchday Briefing</h2>
            <p className="muted">
              Kompakte Infos zu Form, Schlüsselduellen und Tabellenverläufen. Perfekt, um vor
              dem Tippen ein Gefühl zu bekommen.
            </p>
            <ul className="bullet-list">
              <li>Letzte Ergebnisse & Formkurve</li>
              <li>Top-Scorer und Ausfälle</li>
              <li>Tabellen-Impact jeder Begegnung</li>
            </ul>
          </div>
          <div className="card">
            <ScoreboardPage />
          </div>
        </div>
      )}

      {activeTab === 'tipps' && (
        <div className="card">
          <GamesPage />
        </div>
      )}

      {activeTab === 'bracket' && (
        <div className="card stack-md">
          <div className="card-header-row">
            <div>
              <p className="eyebrow">Turnierbaum</p>
              <h2>Road to MetLife Stadium</h2>
              <p className="muted">Visualisierter Knockout-Pfad mit Zeiten und Spielorten für Achtelfinale bis Finale.</p>
            </div>
            <button className="ghost" onClick={fetchCalendarMatches} disabled={calendarLoading}>
              {calendarLoading ? 'Aktualisiere...' : 'Daten aktualisieren'}
            </button>
          </div>
          <div className="bracket-grid">
            {bracketStages.map((stage) => (
              <div key={stage.id} className="bracket-column">
                <div className="bracket-title">{stage.label}</div>
                {stage.matches.map((match) => (
                  <div key={match.id} className="bracket-card">
                    <div className="bracket-badge">{match.time ? new Date(match.time).toLocaleDateString() : 'TBD'}</div>
                    <p className="bracket-match">{match.title}</p>
                    <p className="muted tiny">{match.venue}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="card stack-md">
          <div className="card-header-row">
            <div>
              <p className="eyebrow">Spielplan</p>
              <h2>Kalender & Kickoff-Slots</h2>
              <p className="muted">Alle Vorrundenspiele als kompakter Kalender mit Flaggen, Gruppen und Startzeiten.</p>
            </div>
            <button className="ghost" onClick={fetchCalendarMatches} disabled={calendarLoading}>
              {calendarLoading ? 'Laden...' : 'Neu laden'}
            </button>
          </div>
          <div className="calendar-grid">
            {calendarByDate.map((day) => (
              <div key={day.date} className="calendar-card">
                <div className="calendar-date">
                  <span className="date-dot" />
                  <div>
                    <p className="eyebrow">{day.label}</p>
                    <strong>{new Date(day.date).toLocaleDateString()}</strong>
                  </div>
                </div>
                <div className="calendar-list">
                  {day.matches.map((match) => (
                    <div key={match.id} className="calendar-row">
                      <div className="calendar-teams">
                        <span className="flag">{match.teamAFlag}</span>
                        <strong>{match.teamA}</strong>
                        <span className="muted tiny">vs</span>
                        <strong>{match.teamB}</strong>
                        <span className="flag">{match.teamBFlag}</span>
                      </div>
                      <div className="calendar-meta">
                        <span className="pill subtle">{match.groupId}</span>
                        <span className="muted tiny">{new Date(match.kickoff).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="muted tiny">{match.venue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {calendarStatus && <p className="status">{calendarStatus}</p>}
        </div>
      )}
    </div>
  );
}

export default KicktippPage;
