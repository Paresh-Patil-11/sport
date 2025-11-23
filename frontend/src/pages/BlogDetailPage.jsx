"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import "./BlogDetailPage.css"

function BlogDetailPage() {
  const { slug } = useParams()
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${slug}`)
        setBlog(res.data)
        setLiked(res.data.likes?.some((like) => like === user?.id))
      } catch (err) {
        setError(err.response?.data?.message || "Blog not found")
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [slug, token, navigate, user?.id])

  const handleLike = async () => {
    try {
      const res = await axios.post(`/api/blogs/${blog._id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } })
      setLiked(res.data.liked)
      setBlog({ ...blog, likes: res.data.likes })
    } catch (err) {
      console.error("Error liking blog:", err)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await axios.post(
        `/api/blogs/${blog._id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setNewComment("")
      // Refetch blog to get updated comments
      const res = await axios.get(`/api/blogs/${slug}`)
      setBlog(res.data)
    } catch (err) {
      console.error("Error adding comment:", err)
    }
  }

  if (loading) return <div className="container mt-4">Loading...</div>
  if (error) return <div className="container mt-4 error-message">{error}</div>
  if (!blog) return <div className="container mt-4">Blog not found</div>

  return (
    <article className="blog-detail">
      <div className="container">
        <div className="blog-detail-header">
          <span className="category-badge">{blog.category}</span>
          <h1>{blog.title}</h1>

          <div className="blog-meta">
            <div className="author-info">
              <img src={blog.author?.avatar || "https://via.placeholder.com/40"} alt={blog.author?.username} />
              <div>
                <p className="author-name">{blog.author?.username}</p>
                <p className="publish-date">{new Date(blog.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="blog-stats">
              <span>{blog.views} views</span>
              <button className={`like-btn ${liked ? "liked" : ""}`} onClick={handleLike}>
                ♥ {blog.likes?.length || 0}
              </button>
            </div>
          </div>

          {blog.featured_image && (
            <div className="featured-image">
              <img src={blog.featured_image || "/placeholder.svg"} alt={blog.title} />
            </div>
          )}
        </div>

        <div className="blog-content">
          <div className="content-main">
            <div className="blog-body" dangerouslySetInnerHTML={{ __html: blog.content }} />

            {blog.tags && blog.tags.length > 0 && (
              <div className="tags">
                {blog.tags.map((tag, idx) => (
                  <span key={idx} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Section */}
            <section className="comments-section">
              <h2>Comments ({blog.comments?.length || 0})</h2>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="comments-list">
                {blog.comments?.map((comment) => (
                  <div key={comment._id} className="comment">
                    <div className="comment-header">
                      <div className="commenter-info">
                        <img
                          src={comment.user?.avatar || "https://via.placeholder.com/32"}
                          alt={comment.user?.username}
                        />
                        <div>
                          <p className="commenter-name">{comment.user?.username}</p>
                          <p className="comment-time">{new Date(comment.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="comment-body">{comment.content}</div>

                    {comment.replies?.length > 0 && (
                      <div className="replies">
                        {comment.replies.map((reply, idx) => (
                          <div key={idx} className="reply">
                            <div className="reply-header">
                              <img src={reply.user?.avatar || "https://via.placeholder.com/28"} alt="" />
                              <div>
                                <p className="reply-author">{reply.user?.username}</p>
                                <p className="reply-time">{new Date(reply.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <p className="reply-content">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogDetailPage
