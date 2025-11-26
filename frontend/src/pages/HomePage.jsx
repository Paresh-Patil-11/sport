// frontend/src/pages/HomePage.jsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function HomePage() {
  const [blogs, setBlogs] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, matchesRes] = await Promise.all([
          axios.get("/api/blogs?page=1"),
          axios.get("/api/matches")
        ])

        setBlogs(blogsRes.data.blogs || [])
        setMatches(matchesRes.data || [])
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getSportIcon = (sport) => {
    const icons = {
      cricket: "🏏",
      football: "⚽",
      tennis: "🎾",
      pubg: "🎮"
    }
    return icons[sport] || "🏆"
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-in">
                Welcome to <span className="text-yellow-300">SportsHub</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100">
                Your ultimate destination for live scores, expert blogs, and sports streaming
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/blogs" 
                  className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Explore Blogs
                </Link>
                <Link 
                  to="/live-scores" 
                  className="px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Live Scores
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop" 
                alt="Sports" 
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🏏", label: "Cricket", count: "50+" },
              { icon: "⚽", label: "Football", count: "100+" },
              { icon: "🎾", label: "Tennis", count: "30+" },
              { icon: "🎮", label: "Esports", count: "40+" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="text-5xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-800">{stat.count}</div>
                <div className="text-gray-600 font-medium">{stat.label} Blogs</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Matches Section */}
      {matches.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                🔴 Live Matches
              </h2>
              <Link 
                to="/live-scores" 
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                View All <span>→</span>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.slice(0, 3).map((match) => (
                <div key={match._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 flex justify-between items-center">
                    <span className="flex items-center gap-2 text-white font-semibold">
                      <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                      {match.status?.toUpperCase() || 'LIVE'}
                    </span>
                    <span className="text-white text-sm">{getSportIcon(match.sport)} {match.sport}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-center flex-1">
                        <div className="text-lg font-bold text-gray-800 mb-2">{match.team1?.name || "Team 1"}</div>
                        <div className="text-4xl font-bold text-blue-600">{match.team1?.score ?? "-"}</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-400">VS</div>
                      <div className="text-center flex-1">
                        <div className="text-lg font-bold text-gray-800 mb-2">{match.team2?.name || "Team 2"}</div>
                        <div className="text-4xl font-bold text-purple-600">{match.team2?.score ?? "-"}</div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-600 border-t pt-4">
                      📍 {match.venue || "Stadium"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Blogs Section */}
      {blogs.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                📰 Latest Blogs
              </h2>
              <Link 
                to="/blogs" 
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                View All <span>→</span>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.slice(0, 6).map((blog) => (
                <Link 
                  key={blog._id} 
                  to={`/blog/${blog.slug}`}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={blog.featured_image || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop"} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
                      {getSportIcon(blog.category)} {blog.category?.toUpperCase()}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="font-semibold text-blue-600">{blog.author?.username || "Anonymous"}</span>
                      <span>👁️ {blog.views || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Join the Action?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Get access to exclusive content, live updates, and expert analysis
          </p>
          <Link 
            to="/register" 
            className="inline-block px-10 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Sign Up Now - It's Free!
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage