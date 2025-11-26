// frontend/src/pages/BlogDetailPage.jsx
import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"

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
      const res = await axios.post(`/api/blogs/${blog._id}/like`, {}, { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      setLiked(res.data.liked)
      setBlog({ ...blog, likes: Array(res.data.likes).fill(null) })
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
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNewComment("")
      const res = await axios.get(`/api/blogs/${slug}`)
      setBlog(res.data)
    } catch (err) {
      console.error("Error adding comment:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => navigate("/blogs")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Back to Blogs
        </button>
      </div>
    )
  }

  if (!blog) return null

  const getSportIcon = (category) => {
    const icons = { cricket: "🏏", football: "⚽", tennis: "🎾", pubg: "🎮" }
    return icons[category] || "📰"
  }

  return (
    <article className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold">
              {getSportIcon(blog.category)} {blog.category?.toUpperCase()}
            </span>
            {blog.author?.username === "SportsHub_Bot" && (
              <span className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold animate-pulse">
                🔴 LIVE
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-gray-200">
            <div className="flex items-center gap-4">
              <img 
                src={blog.author?.avatar || "https://ui-avatars.com/api/?name=" + blog.author?.username}
                alt={blog.author?.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-800">{blog.author?.username}</p>
                <p className="text-sm text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-600 flex items-center gap-2">
                👁️ {blog.views || 0} views
              </span>
              <button
                onClick={handleLike}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  liked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
              >
                ♥ {blog.likes?.length || 0}
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featured_image && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-auto"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=600&fit=crop"
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-gray-800 prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-ul:list-disc prose-ul:pl-6
              prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 prose-li:my-2
              prose-img:rounded-xl prose-img:shadow-lg
              prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-4 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            💬 Comments ({blog.comments?.length || 0})
          </h2>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none resize-none"
              required
            />
            <button 
              type="submit"
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {blog.comments?.map((comment) => (
              <div key={comment._id} className="border-l-4 border-blue-600 pl-6 py-4">
                <div className="flex items-start gap-4 mb-3">
                  <img 
                    src={comment.user?.avatar || "https://ui-avatars.com/api/?name=" + comment.user?.username}
                    alt={comment.user?.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-800">{comment.user?.username}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies?.length > 0 && (
                  <div className="ml-14 mt-4 space-y-3">
                    {comment.replies.map((reply, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-sm text-gray-800">{reply.user?.username}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {blog.comments?.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default BlogDetailPage