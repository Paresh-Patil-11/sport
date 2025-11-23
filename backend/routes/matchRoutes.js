import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import adminMiddleware from "../middleware/adminMiddleware.js"
import Match from "../models/Match.js"
import LiveMatch from "../models/LiveMatch.js"

const router = express.Router()

// Get all matches
router.get("/", async (req, res) => {
  try {
    const sport = req.query.sport
    const query = sport ? { sport } : {}

    const matches = await Match.find(query).sort({ startTime: -1 })
    res.json(matches)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get live matches only
router.get("/live/all", async (req, res) => {
  try {
    const liveMatches = await LiveMatch.find({ status: "live" }).sort({ startTime: -1 })
    res.json(liveMatches)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get single match
router.get("/:id", async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
    if (!match) {
      return res.status(404).json({ message: "Match not found" })
    }
    res.json(match)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get live match details
router.get("/live/:matchId", async (req, res) => {
  try {
    const liveMatch = await LiveMatch.findById(req.params.matchId)
    if (!liveMatch) {
      return res.status(404).json({ message: "Live match not found" })
    }
    res.json(liveMatch)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create match (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, sport, team1, team2, venue, startTime } = req.body

    const match = new Match({
      title,
      sport,
      team1,
      team2,
      venue,
      startTime,
      status: "scheduled",
    })

    await match.save()

    // Create live match document
    const liveMatch = new LiveMatch({
      matchId: match._id,
      title,
      sport,
      team1,
      team2,
      venue,
      startTime,
      status: "scheduled",
    })

    await liveMatch.save()

    res.status(201).json({ match, liveMatch })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update match status to live (admin only)
router.patch("/:id/go-live", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, { status: "live" }, { new: true })

    const liveMatch = await LiveMatch.findOneAndUpdate({ matchId: req.params.id }, { status: "live" }, { new: true })

    res.json({ match, liveMatch })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add commentary (admin/editor only)
router.post("/:matchId/commentary", authMiddleware, async (req, res) => {
  try {
    const { text, ball } = req.body

    if (req.userRole !== "admin" && req.userRole !== "editor") {
      return res.status(403).json({ message: "Not authorized" })
    }

    const liveMatch = await LiveMatch.findByIdAndUpdate(
      req.params.matchId,
      {
        $push: {
          commentary: {
            timestamp: new Date(),
            commentary: text,
            ball,
          },
        },
      },
      { new: true },
    )

    res.json(liveMatch)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Create poll (admin only)
router.post("/:matchId/polls", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { question, options } = req.body

    const poll = {
      question,
      options: options.map((opt) => ({ option: opt, votes: 0 })),
    }

    const liveMatch = await LiveMatch.findByIdAndUpdate(req.params.matchId, { $push: { polls: poll } }, { new: true })

    res.json(liveMatch)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
