// frontend/src/pages/BlogsPage.jsx - TAILWIND VERSION
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function BlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [thirdPartyBlogs, setThirdPartyBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchBlogs()
  }, [category, page, activeTab])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      let url = activeTab === "all" 
        ? `/api/blogs${category !== "all" ? `/category/${category}` : `?page=${page}`}`
        : `/api/third-party-blogs`

      const res = await axios.get(url)
      
      if (activeTab === "all") {
        setBlogs(res.data.blogs || res.data)
        if (res.data.pagination) setTotalPages(res.data.pagination.totalPages)
      } else {
        setThirdPartyBlogs(res.data.blogs || res.data)
      }
    } catch (err) {
      console.error("Error fetching blogs:", err)
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", "cricket", "football", "tennis", "pubg", "general"]
  const displayBlogs = activeTab === "all" ? blogs : thirdPartyBlogs

  const getCategoryIcon = (cat) => {
    const icons = {
      cricket: "🏏",
      football: "⚽",
      tennis: "🎾",
      pubg: "🎮",
      general: "📰",
      all: "🌟"
    }
    return icons[cat] || "📝"
  }

  const getCategoryColor = (cat) => {
    const colors = {
      cricket: "from-green-500 to-emerald-600",
      football: "from-blue-500 to-indigo-600",
      tennis: "from-yellow-500 to-orange-600",
      pubg: "from-purple-500 to-pink-600",
      general: "from-gray-500 to-slate-600"
    }
    return colors[cat] || "from-blue-500 to-indigo-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">
            Sports Blogs & News
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Live updates, expert analysis, and breaking stories from the world of sports
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "all"
                ? "text-blue-600 border-b-4 border-blue-600 -mb-0.5"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            📰 Our Blogs
          </button>
          <button
            onClick={() => setActiveTab("third-party")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "third-party"
                ? "text-blue-600 border-b-4 border-blue-600 -mb-0.5"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            🌐 From the Web
          </button>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat)
                  setPage(1)
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                  category === cat
                    ? `bg-gradient-to-r ${getCategoryColor(cat)} text-white shadow-lg`
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                }`}
              >
                {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading amazing content...</p>
            </div>
          </div>
        ) : displayBlogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No blogs found</h3>
            <p className="text-gray-500">Check back soon for new content!</p>
          </div>
        ) : (
          <>
            {/* Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={activeTab === "all" ? `/blog/${blog.slug}` : `/third-party-blog/${blog.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                      <img
                        src={blog.featured_image || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop"}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop"
                        }}
                      />
                      
                      {/* Category Badge */}
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(blog.category)} text-white text-xs font-bold shadow-lg`}>
                        {getCategoryIcon(blog.category)} {blog.category.toUpperCase()}
                      </div>
                      
                      {/* Live Badge for Auto-generated */}
                      {blog.author?.username === "SportsHub_Bot" && (
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-lg animate-pulse">
                          🔴 LIVE
                        </div>
                      )}
                      
                      {/* Third Party Badge */}
                      {activeTab === "third-party" && (
                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg">
                          {blog.source?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {blog.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-600">
                            {blog.author?.username || blog.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            👁️ {blog.views || 0}
                          </span>
                          {activeTab === "all" && (
                            <span className="flex items-center gap-1">
                              ❤️ {blog.likes?.length || 0}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {activeTab === "all" && category === "all" && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    page === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  ← Previous
                </button>
                
                <span className="px-6 py-3 bg-white rounded-lg shadow font-semibold text-gray-700">
                  Page {page} of {totalPages}
                </span>
                
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    page === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BlogsPage