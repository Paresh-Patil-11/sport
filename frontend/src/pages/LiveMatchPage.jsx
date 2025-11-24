import { useState, useEffect } from 'react';

function LiveMatchPage() {
  const [sport, setSport] = useState('cricket');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchMatches();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMatches, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [sport, autoRefresh]);

  const fetchMatches = async () => {
    setLoading(true);
    
    // Simulate API call - Replace with actual API integration
    setTimeout(() => {
      const mockData = {
        cricket: [
          {
            id: 1,
            title: 'India vs Australia',
            status: 'live',
            team1: { name: 'India', logo: '🇮🇳', score: 287, wickets: 5, overs: 45.2 },
            team2: { name: 'Australia', logo: '🇦🇺', score: 156, wickets: 3, overs: 28.4 },
            venue: 'Melbourne Cricket Ground',
            currentBatter: 'Virat Kohli - 87* (92)',
            currentBowler: 'Pat Cummins - 2/45 (8.2)',
            liveCommentary: 'Brilliant shot! Kohli drives through covers for four!'
          },
          {
            id: 2,
            title: 'England vs Pakistan',
            status: 'scheduled',
            team1: { name: 'England', logo: '🏴󐁧󐁢󐁥󐁮󐁧󐁿', score: 0, wickets: 0, overs: 0 },
            team2: { name: 'Pakistan', logo: '🇵🇰', score: 0, wickets: 0, overs: 0 },
            venue: 'Lords Cricket Ground',
            startTime: '14:00 GMT'
          }
        ],
        football: [
          {
            id: 3,
            title: 'Manchester United vs Liverpool',
            status: 'live',
            team1: { name: 'Man United', logo: '🔴', score: 2 },
            team2: { name: 'Liverpool', logo: '🔴', score: 1 },
            venue: 'Old Trafford',
            time: '67\'',
            liveCommentary: 'GOAL! Rashford scores with a stunning strike!'
          }
        ],
        tennis: [
          {
            id: 4,
            title: 'Australian Open - Finals',
            status: 'live',
            player1: { name: 'Novak Djokovic', logo: '🎾', sets: [6, 4, 6] },
            player2: { name: 'Rafael Nadal', logo: '🎾', sets: [3, 6, 4] },
            venue: 'Rod Laver Arena',
            currentSet: 'Set 4: 3-2'
          }
        ]
      };
      
      setMatches(mockData[sport] || []);
      setLoading(false);
    }, 500);
  };

  const MatchCard = ({ match }) => {
    const isLive = match.status === 'live';
    
    return (
      <div className="match-card">
        <div className="match-header">
          <div className="match-title">{match.title}</div>
          <div className={`status-indicator ${match.status}`}>
            {isLive && <span className="pulse-dot"></span>}
            {match.status.toUpperCase()}
          </div>
        </div>

        {sport === 'cricket' && (
          <div className="cricket-score">
            <div className="team-score">
              <div className="team-name">
                <span className="team-logo">{match.team1.logo}</span>
                {match.team1.name}
              </div>
              <div className="score">
                <span className="runs">{match.team1.score}/{match.team1.wickets}</span>
                <span className="overs">({match.team1.overs} ov)</span>
              </div>
            </div>

            <div className="vs-divider">VS</div>

            <div className="team-score">
              <div className="team-name">
                <span className="team-logo">{match.team2.logo}</span>
                {match.team2.name}
              </div>
              <div className="score">
                <span className="runs">{match.team2.score}/{match.team2.wickets}</span>
                <span className="overs">({match.team2.overs} ov)</span>
              </div>
            </div>

            {isLive && (
              <>
                <div className="live-info">
                  <div className="player-stat">
                    <span className="label">🏏 Batting:</span>
                    <span className="value">{match.currentBatter}</span>
                  </div>
                  <div className="player-stat">
                    <span className="label">⚡ Bowling:</span>
                    <span className="value">{match.currentBowler}</span>
                  </div>
                </div>
                
                {match.liveCommentary && (
                  <div className="live-commentary">
                    <span className="commentary-icon">💬</span>
                    {match.liveCommentary}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {sport === 'football' && (
          <div className="football-score">
            <div className="team-score-simple">
              <span className="team-logo">{match.team1.logo}</span>
              <span className="team-name">{match.team1.name}</span>
              <span className="score-large">{match.team1.score}</span>
            </div>
            
            <div className="match-time">{match.time || 'VS'}</div>
            
            <div className="team-score-simple">
              <span className="score-large">{match.team2.score}</span>
              <span className="team-name">{match.team2.name}</span>
              <span className="team-logo">{match.team2.logo}</span>
            </div>

            {match.liveCommentary && (
              <div className="live-commentary">
                <span className="commentary-icon">⚽</span>
                {match.liveCommentary}
              </div>
            )}
          </div>
        )}

        <div className="match-footer">
          <span className="venue">📍 {match.venue}</span>
          <button className="btn-view-details">View Full Scorecard →</button>
        </div>
      </div>
    );
  };

  return (
    <div className="live-match-container">
      <style>{`
        .live-match-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .controls-bar {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .sport-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .sport-tab {
          padding: 0.75rem 1.5rem;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sport-tab.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .sport-tab:hover:not(.active) {
          border-color: #667eea;
          color: #667eea;
        }

        .refresh-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .auto-refresh-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #4a5568;
        }

        .toggle-switch {
          position: relative;
          width: 3rem;
          height: 1.5rem;
          background: #cbd5e0;
          border-radius: 9999px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .toggle-switch.active {
          background: #667eea;
        }

        .toggle-slider {
          position: absolute;
          top: 0.125rem;
          left: 0.125rem;
          width: 1.25rem;
          height: 1.25rem;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s;
        }

        .toggle-switch.active .toggle-slider {
          transform: translateX(1.5rem);
        }

        .btn-refresh {
          padding: 0.75rem 1.5rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .btn-refresh:hover {
          background: #5568d3;
          transform: translateY(-2px);
        }

        .matches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 1.5rem;
        }

        .match-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s;
        }

        .match-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .match-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .match-title {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-indicator.live {
          background: #ef4444;
          animation: pulse-glow 2s infinite;
        }

        .pulse-dot {
          width: 0.5rem;
          height: 0.5rem;
          background: white;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
          50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.8); }
        }

        .cricket-score, .football-score {
          padding: 1.5rem;
        }

        .team-score {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .team-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          font-size: 1.125rem;
          color: #1a202c;
        }

        .team-logo {
          font-size: 1.5rem;
        }

        .score {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .runs {
          font-size: 1.875rem;
          font-weight: 700;
          color: #667eea;
        }

        .overs {
          font-size: 0.875rem;
          color: #718096;
        }

        .vs-divider {
          text-align: center;
          color: #cbd5e0;
          font-weight: 700;
          margin: 0.5rem 0;
        }

        .live-info {
          background: #edf2f7;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .player-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .player-stat .label {
          color: #4a5568;
          font-size: 0.875rem;
        }

        .player-stat .value {
          color: #1a202c;
          font-weight: 600;
        }

        .live-commentary {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 1rem;
          margin-top: 1rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
          color: #92400e;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .commentary-icon {
          font-size: 1.25rem;
        }

        .football-score {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 1.5rem;
        }

        .team-score-simple {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .score-large {
          font-size: 3rem;
          font-weight: 700;
          color: #667eea;
        }

        .match-time {
          font-size: 1.25rem;
          font-weight: 600;
          color: #4a5568;
          padding: 0 1rem;
        }

        .match-footer {
          background: #f7fafc;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #e2e8f0;
        }

        .venue {
          color: #4a5568;
          font-size: 0.875rem;
        }

        .btn-view-details {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-view-details:hover {
          background: #5568d3;
          transform: translateX(4px);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: white;
        }

        .spinner {
          width: 3rem;
          height: 3rem;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .live-match-container {
            padding: 1rem;
          }

          .controls-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .sport-tabs {
            justify-content: center;
          }

          .matches-grid {
            grid-template-columns: 1fr;
          }

          .football-score {
            flex-direction: column;
            gap: 1rem;
          }

          .score-large {
            font-size: 2rem;
          }

          .match-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .btn-view-details {
            width: 100%;
          }
        }
      `}</style>

      <div className="controls-bar">
        <div className="sport-tabs">
          <button 
            className={`sport-tab ${sport === 'cricket' ? 'active' : ''}`}
            onClick={() => setSport('cricket')}
          >
            🏏 Cricket
          </button>
          <button 
            className={`sport-tab ${sport === 'football' ? 'active' : ''}`}
            onClick={() => setSport('football')}
          >
            ⚽ Football
          </button>
          <button 
            className={`sport-tab ${sport === 'tennis' ? 'active' : ''}`}
            onClick={() => setSport('tennis')}
          >
            🎾 Tennis
          </button>
        </div>

        <div className="refresh-controls">
          <div className="auto-refresh-toggle">
            <span>Auto Refresh</span>
            <div 
              className={`toggle-switch ${autoRefresh ? 'active' : ''}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
          <button className="btn-refresh" onClick={fetchMatches}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem' }}>Loading live matches...</p>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LiveMatchPage;