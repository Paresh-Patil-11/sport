// backend/routes/autoBlogRoutes.js
import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import adminMiddleware from "../middleware/adminMiddleware.js"
import { 
  generateAllSportsBlogs,
  generateCricketBlogs,
  generateFootballBlogs,
  generatePubgBlogs,
  archiveOldBlogs,
  fetchLiveCricketMatches,
  fetchLiveFootballMatches,
  fetchPubgMatches
} from "../services/autoBlogGenerator.js"
import { triggerManualGeneration } from "../services/blogScheduler.js"
import Blog from "../models/Blog.js"
import User from "../models/User.js"

const router = express.Router()

// Protect all routes with authentication
router.use(authMiddleware)

/**
 * GET /api/auto-blogs/status
 * Get auto blog generation status
 */
router.get("/status", async (req, res) => {
  try {
    const botUser = await User.findOne({ username: "SportsHub_Bot" })
    
    if (!botUser) {
      return res.json({
        enabled: false,
        message: "Auto blog generation not initialized"
      })
    }

    const totalAutoBlogs = await Blog.countDocuments({ 
      author: botUser._id 
    })

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentBlogs = await Blog.countDocuments({
      author: botUser._id,
      createdAt: { $gte: last24Hours }
    })

    const blogsByCategory = await Blog.aggregate([
      { $match: { author: botUser._id } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ])

    res.json({
      enabled: true,
      totalAutoBlogs,
      last24Hours: recentBlogs,
      byCategory: blogsByCategory,
      botUser: {
        id: botUser._id,
        username: botUser.username
      }
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching status", 
      error: error.message 
    })
  }
})

/**
 * POST /api/auto-blogs/generate/manual
 * Manually trigger blog generation (Admin only)
 */
router.post("/generate/manual", adminMiddleware, async (req, res) => {
  try {
    const result = await triggerManualGeneration()
    res.json({
      message: "Manual generation completed",
      result
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Generation failed", 
      error: error.message 
    })
  }
})

/**
 * POST /api/auto-blogs/generate/cricket
 * Generate cricket blogs only (Admin only)
 */
router.post("/generate/cricket", adminMiddleware, async (req, res) => {
  try {
    const count = await generateCricketBlogs()
    res.json({
      message: `Generated ${count} cricket blogs`,
      count
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Cricket generation failed", 
      error: error.message 
    })
  }
})

/**
 * POST /api/auto-blogs/generate/football
 * Generate football blogs only (Admin only)
 */
router.post("/generate/football", adminMiddleware, async (req, res) => {
  try {
    const count = await generateFootballBlogs()
    res.json({
      message: `Generated ${count} football blogs`,
      count
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Football generation failed", 
      error: error.message 
    })
  }
})

/**
 * POST /api/auto-blogs/generate/pubg
 * Generate PUBG blogs only (Admin only)
 */
router.post("/generate/pubg", adminMiddleware, async (req, res) => {
  try {
    const count = await generatePubgBlogs()
    res.json({
      message: `Generated ${count} PUBG blogs`,
      count
    })
  } catch (error) {
    res.status(500).json({ 
      message: "PUBG generation failed", 
      error: error.message 
    })
  }
})

/**
 * POST /api/auto-blogs/archive
 * Archive old blogs (Admin only)
 */
router.post("/archive", adminMiddleware, async (req, res) => {
  try {
    const count = await archiveOldBlogs()
    res.json({
      message: `Archived ${count} old blogs`,
      count
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Archive failed", 
      error: error.message 
    })
  }
})

/**
 * GET /api/auto-blogs/live-data/cricket
 * Get live cricket match data (for testing)
 */
router.get("/live-data/cricket", async (req, res) => {
  try {
    const matches = await fetchLiveCricketMatches()
    res.json({
      count: matches.length,
      matches
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch cricket data", 
      error: error.message 
    })
  }
})

/**
 * GET /api/auto-blogs/live-data/football
 * Get live football match data (for testing)
 */
router.get("/live-data/football", async (req, res) => {
  try {
    const matches = await fetchLiveFootballMatches()
    res.json({
      count: matches.length,
      matches
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch football data", 
      error: error.message 
    })
  }
})

/**
 * GET /api/auto-blogs/live-data/pubg
 * Get PUBG tournament data (for testing)
 */
router.get("/live-data/pubg", async (req, res) => {
  try {
    const tournaments = await fetchPubgMatches()
    res.json({
      count: tournaments.length,
      tournaments
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch PUBG data", 
      error: error.message 
    })
  }
})

/**
 * GET /api/auto-blogs/recent
 * Get recent auto-generated blogs
 */
router.get("/recent", async (req, res) => {
  try {
    const botUser = await User.findOne({ username: "SportsHub_Bot" })
    
    if (!botUser) {
      return res.json({ blogs: [] })
    }

    const limit = parseInt(req.query.limit) || 20
    const blogs = await Blog.find({ author: botUser._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "username")

    res.json({
      count: blogs.length,
      blogs
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching recent blogs", 
      error: error.message 
    })
  }
})

/**
 * DELETE /api/auto-blogs/clear-all
 * Delete all auto-generated blogs (Admin only - use with caution!)
 */
router.delete("/clear-all", adminMiddleware, async (req, res) => {
  try {
    const botUser = await User.findOne({ username: "SportsHub_Bot" })
    
    if (!botUser) {
      return res.status(404).json({ message: "Bot user not found" })
    }

    const result = await Blog.deleteMany({ author: botUser._id })
    
    res.json({
      message: `Deleted ${result.deletedCount} auto-generated blogs`,
      deletedCount: result.deletedCount
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Clear failed", 
      error: error.message 
    })
  }
})

export default router