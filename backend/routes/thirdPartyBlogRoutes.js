import express from "express"
import ThirdPartyBlog from "../models/ThirdPartyBlog.js"
import {
  fetchFromDevTo,
  fetchFromMedium,
  fetchFromHashnode,
  fetchFromRSS,
  fetchAllThirdPartySources,
} from "../services/thirdPartyFetcher.js"

const router = express.Router()

// Get all third-party blogs with pagination
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 10
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

// Get third-party blogs by source
router.get("/source/:source", async (req, res) => {
  try {
    const blogs = await ThirdPartyBlog.find({ source: req.params.source }).sort({ createdAt: -1 }).limit(20)

    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get single third-party blog by slug
router.get("/blog/:slug", async (req, res) => {
  try {
    const blog = await ThirdPartyBlog.findOne({ slug: req.params.slug })

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Increment views
    blog.views += 1
    await blog.save()

    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Fetch from specific source
router.post("/fetch/devto", async (req, res) => {
  try {
    const blogs = await fetchFromDevTo()
    res.json({ message: `Fetched ${blogs.length} blogs from Dev.to`, blogs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/fetch/medium", async (req, res) => {
  try {
    const blogs = await fetchFromMedium()
    res.json({ message: `Fetched ${blogs.length} blogs from Medium`, blogs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/fetch/hashnode", async (req, res) => {
  try {
    const blogs = await fetchFromHashnode()
    res.json({ message: `Fetched ${blogs.length} blogs from Hashnode`, blogs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post("/fetch/rss", async (req, res) => {
  try {
    const { feedUrl, source } = req.body
    if (!feedUrl) return res.status(400).json({ message: "feedUrl required" })

    const blogs = await fetchFromRSS(feedUrl, source || "rss")
    res.json({ message: `Fetched ${blogs.length} blogs from RSS`, blogs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Fetch all sources
router.post("/fetch/all", async (req, res) => {
  try {
    const results = await fetchAllThirdPartySources()
    const totalFetched = Object.values(results).reduce((sum, arr) => sum + arr.length, 0)

    res.json({
      message: `Fetched ${totalFetched} blogs from all sources`,
      results,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get raw third-party blog data
router.get("/raw/:slug", async (req, res) => {
  try {
    const blog = await ThirdPartyBlog.findOne({ slug: req.params.slug })

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    res.json({
      blog: {
        title: blog.title,
        source: blog.source,
        sourceUrl: blog.sourceUrl,
        author: blog.author,
        content: blog.content,
      },
      rawData: blog.rawData,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
