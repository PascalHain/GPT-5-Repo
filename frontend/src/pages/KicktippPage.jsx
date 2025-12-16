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
const weekdayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

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

  const calendarMonths = useMemo(() => {
    if (!calendarMatches.length) return [];

    const matchesByDate = calendarMatches.reduce((acc, match) => {
      const dayKey = new Date(match.kickoff).toISOString().split('T')[0];
      acc[dayKey] = acc[dayKey] ? [...acc[dayKey], match] : [match];
      return acc;
    }, {});

    const monthBuckets = {};

    calendarMatches
      .slice()
      .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))
      .forEach((match) => {
        const kickoff = new Date(match.kickoff);
        const monthKey = `${kickoff.getFullYear()}-${kickoff.getMonth()}`;
        if (!monthBuckets[monthKey]) {
          monthBuckets[monthKey] = {
            year: kickoff.getFullYear(),
            month: kickoff.getMonth(),
            label: kickoff.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
            matchesByDate,
          };
        }
      });

    return Object.values(monthBuckets)
      .map((bucket) => {
        const firstDay = new Date(bucket.year, bucket.month, 1);
        const startOffset = (firstDay.getDay() + 6) % 7; // Monday as first day
        const daysInMonth = new Date(bucket.year, bucket.month + 1, 0).getDate();
        const cells = [];

        for (let i = 0; i < startOffset; i += 1) {
          cells.push({ empty: true });
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
          const dateKey = new Date(bucket.year, bucket.month, day).toISOString().split('T')[0];
          cells.push({
            empty: false,
            day,
            dateKey,
            matches: (bucket.matchesByDate[dateKey] || []).sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff)),
          });
        }

        while (cells.length % 7 !== 0) {
          cells.push({ empty: true });
        }

        const weeks = [];
        for (let i = 0; i < cells.length; i += 7) {
          weeks.push(cells.slice(i, i + 7));
        }

        return { ...bucket, weeks };
      })
      .sort((a, b) => new Date(a.year, a.month, 1) - new Date(b.year, b.month, 1));
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
              <p className="muted">
                Monatsübersicht mit echten Kalender-Spalten (Mo-So), Flaggen, Gruppen-Badges und Startzeiten pro Slot.
              </p>
            </div>
            <button className="ghost" onClick={fetchCalendarMatches} disabled={calendarLoading}>
              {calendarLoading ? 'Laden...' : 'Neu laden'}
            </button>
          </div>
          <div className="calendar-board">
            {calendarMonths.map((month) => (
              <div key={`${month.year}-${month.month}`} className="calendar-month">
                <div className="calendar-month-header">
                  <div>
                    <p className="eyebrow">WM 2026</p>
                    <h3>{month.label}</h3>
                  </div>
                  <div className="pill subtle">Mo - So</div>
                </div>
                <div className="calendar-weekdays">
                  {weekdayLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                {month.weeks.map((week, weekIdx) => (
                  <div key={`${month.label}-w${weekIdx}`} className="calendar-week">
                    {week.map((day, idx) => (
                      <div key={`${month.label}-w${weekIdx}-d${idx}`} className={day.empty ? 'calendar-day empty' : 'calendar-day'}>
                        {!day.empty && (
                          <>
                            <div className="calendar-day-header">
                              <span className="day-number">{day.day}</span>
                              <span className="day-chip">{day.matches.length ? `${day.matches.length} Spiel(e)` : '—'}</span>
                            </div>
                            <div className="calendar-day-matches">
                              {day.matches.map((match) => (
                                <div key={match.id} className="calendar-match">
                                  <div className="calendar-match-teams">
                                    <span className="flag">{match.teamAFlag}</span>
                                    <strong>{match.teamA}</strong>
                                    <span className="muted tiny">vs</span>
                                    <strong>{match.teamB}</strong>
                                    <span className="flag">{match.teamBFlag}</span>
                                  </div>
                                  <div className="calendar-match-meta">
                                    <span className="pill subtle">{match.groupId}</span>
                                    <span className="muted tiny">
                                      {new Date(match.kickoff).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="muted tiny">{match.venue}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
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
