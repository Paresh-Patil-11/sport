"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./HomePage.css"

function HomePage() {
  const [blogs, setBlogs] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, matchesRes] = await Promise.all([
          axios.get("/api/blogs"),
          axios.get("/api/matches")
        ])

        // Ensure blogs and matches are arrays
        setBlogs(Array.isArray(blogsRes.data) ? blogsRes.data : [])
        setMatches(Array.isArray(matchesRes.data) ? matchesRes.data : [])
      } catch (err) {
        console.error("Error fetching data:", err)
        setBlogs([])
        setMatches([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to SportsHub</h1>
            <p>Your ultimate destination for live scores, expert blogs, and sports streaming</p>
            <button className="btn btn-primary">Explore Now</button>
          </div>
          <div className="hero-image">
            <img src="https://via.placeholder.com/500x300?text=Sports+Hero" alt="Sports" />
          </div>
        </div>
      </section>

      {/* Live Matches Ticker */}
      {Array.isArray(matches) && matches.length > 0 && (
        <section className="live-ticker">
          <div className="container">
            <h2>Live Matches</h2>
            <div className="matches-grid">
              {matches.slice(0, 3).map((match) => (
                <div key={match._id} className="match-card">
                  <div className="match-header">
                    <span className={`status ${match.status}`}>{match.status?.toUpperCase()}</span>
                  </div>
                  <div className="teams">
                    <div className="team">
                      <span>{match.team1?.name || "Team 1"}</span>
                      <span className="score">{match.team1?.score ?? "-"}</span>
                    </div>
                    <div className="vs">VS</div>
                    <div className="team">
                      <span>{match.team2?.name || "Team 2"}</span>
                      <span className="score">{match.team2?.score ?? "-"}</span>
                    </div>
                  </div>
                  <div className="match-footer">
                    <span className="venue">{match.venue || "Unknown"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Blogs */}
      {Array.isArray(blogs) && blogs.length > 0 && (
        <section className="featured-blogs">
          <div className="container">
            <h2>Latest Blogs</h2>
            <div className="blogs-grid">
              {blogs.slice(0, 6).map((blog) => (
                <article key={blog._id} className="blog-card">
                  <div className="blog-image">
                    <img src={blog.featured_image || "https://via.placeholder.com/300x200"} alt={blog.title || "Blog"} />
                  </div>
                  <div className="blog-content">
                    <span className="category">{blog.category || "General"}</span>
                    <h3>{blog.title || "Untitled"}</h3>
                    <p>{blog.excerpt || "No excerpt available."}</p>
                    <div className="blog-meta">
                      <span className="author">{blog.author?.username || "Anonymous"}</span>
                      <span className="views">{blog.views ?? 0} views</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage
