import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import User from "../models/User.js"
import Blog from "../models/Blog.js"

const router = express.Router()

// Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followingUsers", "username avatar")
      .populate("followers", "username avatar")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get user's blogs
    const blogs = await Blog.find({ author: req.params.id, published: true })
      .select("title slug views likes createdAt")
      .sort({ createdAt: -1 })

    res.json({
      user,
      stats: {
        blogs: blogs.length,
        followers: user.followers.length,
        following: user.followingUsers.length,
        totalViews: blogs.reduce((sum, blog) => sum + blog.views, 0),
        totalLikes: blogs.reduce((sum, blog) => sum + blog.likes.length, 0),
      },
      recentBlogs: blogs.slice(0, 5),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update user profile
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.userId !== req.params.id && req.userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    const { username, bio, avatar, favoriteTeams } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: username || undefined,
          bio: bio || undefined,
          avatar: avatar || undefined,
          favoriteTeams: favoriteTeams || undefined,
        },
      },
      { new: true },
    ).select("-password")

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Follow user
router.post("/:id/follow", authMiddleware, async (req, res) => {
  try {
    if (req.params.id === req.userId) {
      return res.status(400).json({ message: "Cannot follow yourself" })
    }

    const targetUser = await User.findById(req.params.id)
    const currentUser = await User.findById(req.userId)

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const isFollowing = targetUser.followers.includes(req.userId)

    if (isFollowing) {
      targetUser.followers = targetUser.followers.filter((f) => f.toString() !== req.userId)
      currentUser.followingUsers = currentUser.followingUsers.filter((f) => f.toString() !== req.params.id)
    } else {
      targetUser.followers.push(req.userId)
      currentUser.followingUsers.push(req.params.id)
    }

    await targetUser.save()
    await currentUser.save()

    res.json({
      message: isFollowing ? "Unfollowed" : "Followed",
      isFollowing: !isFollowing,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get user's followers
router.get("/:id/followers", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "username avatar bio")

    res.json(user.followers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get users following this user
router.get("/:id/following", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followingUsers", "username avatar bio")

    res.json(user.followingUsers)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get user's activity dashboard
router.get("/:id/activity", authMiddleware, async (req, res) => {
  try {
    if (req.userId !== req.params.id && req.userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    const user = await User.findById(req.params.id)

    const blogs = await Blog.find({ author: req.params.id })
      .select("title slug views likes published createdAt")
      .sort({ createdAt: -1 })
      .limit(10)

    const likedBlogs = await Blog.find({ likes: req.params.id })
      .select("title slug author")
      .populate("author", "username")
      .limit(10)

    res.json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      myBlogs: blogs,
      likedBlogs,
      bookmarks: user.favoriteTeams || [],
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
