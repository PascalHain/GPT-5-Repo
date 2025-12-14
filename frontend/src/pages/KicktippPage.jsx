import { useEffect, useState } from 'react';
import GroupOverviewPage from './GroupOverviewPage.jsx';
import GamesPage from './GamesPage.jsx';
import ScoreboardPage from './ScoreboardPage.jsx';

const tabConfig = [
  { id: 'groups', label: 'Gruppen' },
  { id: 'info', label: 'Spielinfos' },
  { id: 'tipps', label: 'Tippen' },
];

function KicktippPage({ initialTab = 'groups' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="stack-xl">
      <div className="mode-header">
        <div>
          <p className="eyebrow">Kicktipp</p>
          <h1>Gruppen, Infos & Tipps</h1>
          <p className="muted">Wechsle oben zwischen Übersicht, Storyline-Infos und deiner Tippabgabe.</p>
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
    </div>
  );
}

export default KicktippPage;
