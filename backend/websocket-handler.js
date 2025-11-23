import LiveMatch from "./models/LiveMatch.js"

const liveConnections = new Map()

export function setupWebSocket(wss) {
  wss.on("connection", (ws) => {
    let userId = null
    let matchId = null

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message)

        switch (data.type) {
          case "join_match":
            userId = data.userId
            matchId = data.matchId

            if (!liveConnections.has(matchId)) {
              liveConnections.set(matchId, new Set())
            }
            liveConnections.get(matchId).add(ws)

            // Send current match state to new user
            const match = await LiveMatch.findById(matchId)
            ws.send(
              JSON.stringify({
                type: "match_state",
                data: match,
              }),
            )

            // Notify others that user joined
            broadcastToMatch(
              matchId,
              {
                type: "user_joined",
                viewers: liveConnections.get(matchId).size,
              },
              ws,
            )
            break

          case "score_update":
            if (liveConnections.has(matchId)) {
              const match = await LiveMatch.findByIdAndUpdate(matchId, { $set: data.updates }, { new: true })

              broadcastToMatch(matchId, {
                type: "score_update",
                data: match,
              })
            }
            break

          case "commentary":
            if (liveConnections.has(matchId)) {
              const match = await LiveMatch.findByIdAndUpdate(
                matchId,
                {
                  $push: {
                    commentary: {
                      timestamp: new Date(),
                      commentary: data.text,
                      ball: data.ball,
                    },
                  },
                },
                { new: true },
              )

              broadcastToMatch(matchId, {
                type: "new_commentary",
                commentary: data.text,
                ball: data.ball,
              })
            }
            break

          case "poll_vote":
            if (liveConnections.has(matchId)) {
              const match = await LiveMatch.findByIdAndUpdate(
                matchId,
                {
                  $inc: {
                    "polls.$[poll].options.$[option].votes": 1,
                  },
                },
                {
                  arrayFilters: [{ "poll._id": data.pollId }, { "option._id": data.optionId }],
                  new: true,
                },
              )

              broadcastToMatch(matchId, {
                type: "poll_update",
                polls: match.polls,
              })
            }
            break
        }
      } catch (err) {
        console.error("WebSocket error:", err)
      }
    })

    ws.on("close", () => {
      if (matchId && liveConnections.has(matchId)) {
        liveConnections.get(matchId).delete(ws)

        broadcastToMatch(matchId, {
          type: "user_left",
          viewers: liveConnections.get(matchId).size,
        })

        if (liveConnections.get(matchId).size === 0) {
          liveConnections.delete(matchId)
        }
      }
    })
  })
}

function broadcastToMatch(matchId, data, excludeWs = null) {
  if (liveConnections.has(matchId)) {
    const connections = liveConnections.get(matchId)
    connections.forEach((client) => {
      if (client !== excludeWs && client.readyState === 1) {
        client.send(JSON.stringify(data))
      }
    })
  }
}

export function broadcastScoreUpdate(matchId, scoreData) {
  broadcastToMatch(matchId, {
    type: "score_update",
    data: scoreData,
  })
}
