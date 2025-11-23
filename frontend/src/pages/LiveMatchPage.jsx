"use client"

import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import "./LiveMatchPage.css"

function LiveMatchPage() {
  const { matchId } = useParams()
  const { user, token } = useContext(AuthContext)
  const [match, setMatch] = useState(null)
  const [ws, setWs] = useState(null)
  const [commentary, setCommentary] = useState([])
  const [selectedPoll, setSelectedPoll] = useState(null)

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const wsUrl = `${protocol}//${window.location.host}`
    const socket = new WebSocket(wsUrl)

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "join_match",
          userId: user?.id,
          matchId,
        }),
      )
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case "match_state":
          setMatch(data.data)
          setCommentary(data.data.commentary || [])
          break
        case "score_update":
          setMatch(data.data)
          break
        case "new_commentary":
          setCommentary((prev) => [
            ...prev,
            {
              timestamp: new Date(),
              commentary: data.commentary,
              ball: data.ball,
            },
          ])
          break
        case "poll_update":
          if (match) {
            setMatch({ ...match, polls: data.polls })
          }
          break
      }
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    setWs(socket)

    return () => {
      socket.close()
    }
  }, [matchId, user?.id])

  if (!match) {
    return <div className="container mt-4">Loading live match...</div>
  }

  return (
    <div className="live-match-page container">
      <div className="match-container">
        <section className="match-scorecard">
          <div className="scorecard-header">
            <span className="status live">LIVE</span>
            <span className="sport-badge">{match.sport.toUpperCase()}</span>
          </div>

          <div className="teams-score">
            <div className="team-box">
              <div className="team-logo">
                <img src={match.team1.logo || "https://via.placeholder.com/60"} alt={match.team1.name} />
              </div>
              <h3>{match.team1.name}</h3>
              <div className="score-display">
                <span className="big-score">{match.team1.score}</span>
                {match.sport === "cricket" && (
                  <span className="sub-score">
                    /{match.team1.wickets} ({match.currentOvers})
                  </span>
                )}
              </div>
            </div>

            <div className="vs-divider">VS</div>

            <div className="team-box">
              <div className="team-logo">
                <img src={match.team2.logo || "https://via.placeholder.com/60"} alt={match.team2.name} />
              </div>
              <h3>{match.team2.name}</h3>
              <div className="score-display">
                <span className="big-score">{match.team2.score}</span>
                {match.sport === "cricket" && (
                  <span className="sub-score">
                    /{match.team2.wickets} ({match.currentOvers})
                  </span>
                )}
              </div>
            </div>
          </div>

          {match.currentBatter && (
            <div className="player-stats">
              <h4>Current Batter</h4>
              <p>
                {match.currentBatter.name}: {match.currentBatter.runs}* ({match.currentBatter.balls})
              </p>
            </div>
          )}

          {match.currentBowler && (
            <div className="player-stats">
              <h4>Current Bowler</h4>
              <p>
                {match.currentBowler.name}: {match.currentBowler.runs}/{match.currentBowler.wickets}
              </p>
            </div>
          )}
        </section>

        <section className="match-content">
          <div className="commentary-section">
            <h3>Live Commentary</h3>
            <div className="commentary-list">
              {commentary.map((item, idx) => (
                <div key={idx} className="commentary-item">
                  <span className="ball">{item.ball}</span>
                  <p>{item.commentary}</p>
                  <span className="time">{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>

          {match.polls && match.polls.length > 0 && (
            <div className="polls-section">
              <h3>Live Polls</h3>
              {match.polls.map((poll) => (
                <div key={poll._id} className="poll">
                  <h4>{poll.question}</h4>
                  <div className="poll-options">
                    {poll.options.map((option) => (
                      <button
                        key={option._id}
                        className="poll-option"
                        onClick={() => {
                          ws?.send(
                            JSON.stringify({
                              type: "poll_vote",
                              matchId,
                              pollId: poll._id,
                              optionId: option._id,
                            }),
                          )
                        }}
                      >
                        <span>{option.option}</span>
                        <span className="votes">{option.votes}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default LiveMatchPage
