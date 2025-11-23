import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import adminMiddleware from "../middleware/adminMiddleware.js"
import User from "../models/User.js"
import Blog from "../models/Blog.js"
import Match from "../models/Match.js"
import ThirdPartyBlog from "../models/ThirdPartyBlog.js"
import {
  fetchFromDevTo,
  fetchFromMedium,
  fetchFromHashnode,
  fetchFromRSS,
  fetchAllThirdPartySources,
} from "../services/thirdPartyFetcher.js"

const router = express.Router()

// Protect all admin routes
router.use(authMiddleware, adminMiddleware)

// Dashboard stats
router.get("/stats/overview", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalBlogs = await Blog.countDocuments()
    const publishedBlogs = await Blog.countDocuments({ published: true })
    const totalMatches = await Match.countDocuments()
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    })

    const thirdPartyBlogsCount = await ThirdPartyBlog.countDocuments()

    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("author", "username")
      .select("title published views createdAt")

    res.json({
      stats: {
        totalUsers,
        totalBlogs,
        publishedBlogs,
        totalMatches,
        activeUsers,
        unpublishedBlogs: totalBlogs - publishedBlogs,
        thirdPartyBlogs: thirdPartyBlogsCount,
      },
      recentBlogs,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get all users
router.get("/users", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 20
    const skip = (page - 1) * limit

    const users = await User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await User.countDocuments()

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update user role
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body

    if (!["user", "editor", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password")

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Ban/unban user
router.patch("/users/:id/ban", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // For demo: mark user with a banned flag (you'd add this to User model in production)
    user.isVerified = !user.isVerified // Using as toggle for demo
    await user.save()

    res.json({ message: user.isVerified ? "User unbanned" : "User banned", user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Moderate blogs (approve/reject/delete)
router.patch("/blogs/:id/status", async (req, res) => {
  try {
    const { published } = req.body

    const blog = await Blog.findByIdAndUpdate(req.params.id, { published }, { new: true }).populate(
      "author",
      "username email",
    )

    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete blog (admin only)
router.delete("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    res.json({ message: "Blog deleted", blog })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get pending blogs for review
router.get("/blogs/pending/review", async (req, res) => {
  try {
    const pendingBlogs = await Blog.find({ published: false })
      .populate("author", "username email")
      .sort({ createdAt: -1 })

    res.json(pendingBlogs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get all matches
router.get("/matches", async (req, res) => {
  try {
    const matches = await Match.find().sort({ startTime: -1 }).limit(50)

    res.json(matches)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update match
router.patch("/matches/:id", async (req, res) => {
  try {
    const { status, team1, team2, venue, startTime } = req.body

    const match = await Match.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: status || undefined,
          team1: team1 || undefined,
          team2: team2 || undefined,
          venue: venue || undefined,
          startTime: startTime || undefined,
        },
      },
      { new: true },
    )

    res.json(match)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Activity logs
router.get("/logs", async (req, res) => {
  try {
    const logs = await Blog.find()
      .select("title author createdAt updatedAt published")
      .populate("author", "username")
      .sort({ updatedAt: -1 })
      .limit(100)

    const userLogs = await User.find().select("username lastLogin createdAt").sort({ lastLogin: -1 }).limit(50)

    res.json({
      blogLogs: logs,
      userLogs,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Third-party blog management endpoints
// Get third-party blogs
router.get("/third-party-blogs", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 20
    const skip = (page - 1) * limit

    const blogs = await ThirdPartyBlog.find().sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await ThirdPartyBlog.countDocuments()

    res.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete third-party blog
router.delete("/third-party-blogs/:id", async (req, res) => {
  try {
    const blog = await ThirdPartyBlog.findByIdAndDelete(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    res.json({ message: "Third-party blog deleted", blog })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Fetch from specific sources
router.post("/third-party-blogs/fetch/devto", async (req, res) => {
  try {
    const blogs = await fetchFromDevTo()
    res.json({ message: `Fetched ${blogs.length} blogs from Dev.to`, count: blogs.length, blogs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/third-party-blogs/fetch/medium", async (req, res) => {
  try {
    const blogs = await fetchFromMedium()
    res.json({ message: `Fetched ${blogs.length} blogs from Medium`, count: blogs.length, blogs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/third-party-blogs/fetch/hashnode", async (req, res) => {
  try {
    const blogs = await fetchFromHashnode()
    res.json({ message: `Fetched ${blogs.length} blogs from Hashnode`, count: blogs.length, blogs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/third-party-blogs/fetch/rss", async (req, res) => {
  try {
    const { feedUrl, source } = req.body
    if (!feedUrl) return res.status(400).json({ message: "feedUrl required" })

    const blogs = await fetchFromRSS(feedUrl, source || "rss")
    res.json({ message: `Fetched ${blogs.length} blogs from RSS`, count: blogs.length, blogs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Fetch all sources at once
router.post("/third-party-blogs/fetch/all", async (req, res) => {
  try {
    const results = await fetchAllThirdPartySources()
    const totalFetched = Object.values(results).reduce((sum, arr) => sum + arr.length, 0)

    res.json({
      message: `Fetched ${totalFetched} blogs from all sources`,
      totalFetched,
      results,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get stats by source
router.get("/third-party-blogs/stats/by-source", async (req, res) => {
  try {
    const stats = await ThirdPartyBlog.aggregate([
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 },
          avgViews: { $avg: "$views" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    res.json(stats)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
