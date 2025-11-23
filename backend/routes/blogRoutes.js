import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import Blog from "../models/Blog.js"

const router = express.Router()

// Get all published blogs with pagination
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const blogs = await Blog.find({ published: true })
      .populate("author", "username avatar")
      .populate("likes", "_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Blog.countDocuments({ published: true })

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

// Get blogs by category
router.get("/category/:category", async (req, res) => {
  try {
    const blogs = await Blog.find({
      category: req.params.category,
      published: true,
    })
      .populate("author", "username avatar")
      .sort({ views: -1 })

    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get trending blogs
router.get("/trending/all", async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const blogs = await Blog.find({
      published: true,
      createdAt: { $gte: thirtyDaysAgo },
    })
      .populate("author", "username avatar")
      .sort({ views: -1, likes: -1 })
      .limit(10)

    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get single blog by slug
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("author", "username avatar bio")
      .populate({
        path: "comments",
        populate: [
          {
            path: "user",
            select: "username avatar",
          },
          {
            path: "replies.user",
            select: "username avatar",
          },
        ],
      })

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

// Create blog (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, featured_image } = req.body

    if (!title || !content || !excerpt) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    let slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

    // Check if slug already exists
    let existingBlog = await Blog.findOne({ slug })
    let counter = 1
    while (existingBlog) {
      slug = `${slug}-${counter}`
      existingBlog = await Blog.findOne({ slug })
      counter++
    }

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      category: category || "general",
      tags: tags || [],
      featured_image,
      author: req.userId,
      published: false,
    })

    await blog.save()
    await blog.populate("author", "username avatar")

    res.status(201).json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update blog (protected)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    if (blog.author.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized to update" })
    }

    const { title, content, excerpt, category, tags, published } = req.body

    blog.title = title || blog.title
    blog.content = content || blog.content
    blog.excerpt = excerpt || blog.excerpt
    blog.category = category || blog.category
    blog.tags = tags || blog.tags
    if (published !== undefined) blog.published = published

    await blog.save()
    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete blog (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    if (blog.author.toString() !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.json({ message: "Blog deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Like blog (protected)
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    const likeIndex = blog.likes.indexOf(req.userId)

    if (likeIndex === -1) {
      blog.likes.push(req.userId)
    } else {
      blog.likes.splice(likeIndex, 1)
    }

    await blog.save()
    res.json({ likes: blog.likes.length, liked: likeIndex === -1 })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add comment (protected)
router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ message: "Comment content required" })
    }

    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    const comment = {
      user: req.userId,
      content,
      createdAt: new Date(),
      replies: [],
    }

    blog.comments.push(comment)
    await blog.save()

    await blog.populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username avatar",
      },
    })

    res.status(201).json(blog.comments[blog.comments.length - 1])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Reply to comment (protected)
router.post("/:blogId/comments/:commentId/reply", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ message: "Reply content required" })
    }

    const blog = await Blog.findById(req.params.blogId)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    const comment = blog.comments.id(req.params.commentId)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    const reply = {
      user: req.userId,
      content,
      createdAt: new Date(),
    }

    comment.replies.push(reply)
    await blog.save()

    res.status(201).json(reply)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
