"use client"

import { useEffect, useState } from "react"
import "./LiveScoreTicker.css"

function LiveScoreTicker() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const res = await fetch("/api/matches/live/all")
        const data = await res.json()
        setMatches(data)
      } catch (err) {
        console.error("Error fetching live matches:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLiveMatches()
    const interval = setInterval(fetchLiveMatches, 30000) // Refresh every 30s

    return () => clearInterval(interval)
  }, [])

  if (loading || matches.length === 0) return null

  return (
    <div className="live-ticker-bar">
      <div className="ticker-label">
        <span className="live-dot"></span>
        LIVE
      </div>
      <div className="ticker-scroll">
        {matches.map((match) => (
          <div key={match._id} className="ticker-item">
            <span className="team">{match.team1.name}</span>
            <span className="score">{match.team1.score}</span>
            <span className="vs">vs</span>
            <span className="score">{match.team2.score}</span>
            <span className="team">{match.team2.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LiveScoreTicker
