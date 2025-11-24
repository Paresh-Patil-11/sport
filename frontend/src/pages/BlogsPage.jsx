"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./BlogsPage.css"

function BlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [thirdPartyBlogs, setThirdPartyBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        let url = "/api/blogs"

        if (category !== "all") {
          url = `/api/blogs/category/${category}`
        } else {
          url = `/api/blogs?page=${page}`
        }

        const res = await axios.get(url)
        setBlogs(res.data.blogs || res.data)

        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages)
        }
      } catch (err) {
        console.error("Error fetching blogs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [category, page])

  useEffect(() => {
    const fetchThirdPartyBlogs = async () => {
      try {
        let url = "/api/third-party-blogs"
        if (sourceFilter !== "all") {
          url = `/api/third-party-blogs/source/${sourceFilter}`
        }
        const res = await axios.get(url)
        setThirdPartyBlogs(res.data.blogs || res.data)
      } catch (err) {
        console.error("Error fetching third-party blogs:", err)
      }
    }

    if (activeTab === "third-party") {
      fetchThirdPartyBlogs()
    }
  }, [activeTab, sourceFilter])

  const categories = ["all", "cricket", "football", "tennis", "pubg", "general"]
  const sources = ["all", "dev.to", "medium", "hashnode", "rss"]

  const displayBlogs = activeTab === "all" ? blogs : thirdPartyBlogs

  // Helper: Safe author display
  const getAuthorName = (author) => {
    if (!author) return "Unknown"

    // If author is a string (e.g., third-party blogs)
    if (typeof author === "string") return author

    // If author is an object (your own blogs)
    return author.username || "Unknown"
  }

  return (
    <div className="blogs-page container">
      <div className="blogs-header">
        <h1>Sports Blogs</h1>
        <p>Expert analysis, breaking news, and insights from our community</p>
      </div>

      <div className="blogs-tabs">
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("all")
            setPage(1)
          }}
        >
          Our Blogs
        </button>
        <button
          className={`tab-btn ${activeTab === "third-party" ? "active" : ""}`}
          onClick={() => setActiveTab("third-party")}
        >
          From the Web
        </button>
      </div>

      <div className="blogs-filters">
        <div className="filter-group">
          <label>{activeTab === "all" ? "Category" : "Source"}:</label>
          <div className="filter-buttons">
            {(activeTab === "all" ? categories : sources).map((item) => (
              <button
                key={item}
                className={`filter-btn ${
                  activeTab === "all"
                    ? category === item
                      ? "active"
                      : ""
                    : sourceFilter === item
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  if (activeTab === "all") {
                    setCategory(item)
                    setPage(1)
                  } else {
                    setSourceFilter(item)
                  }
                }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading blogs...</div>
      ) : displayBlogs.length === 0 ? (
        <div className="empty-state">
          <p>No blogs found</p>
        </div>
      ) : (
        <>
          <div className="blogs-list">
            {displayBlogs.map((blog) => (
              <Link
                key={blog._id}
                to={activeTab === "all" ? `/blog/${blog.slug}` : `/third-party-blog/${blog.slug}`}
                className="blog-item"
              >
                <div className="blog-item-image">
                  <img
                    src={blog.featured_image || "https://placehold.co/400x250"}
                    alt={blog.title}
                  />
                  {activeTab === "third-party" && <span className="source-badge">{blog.source}</span>}
                </div>

                <div className="blog-item-content">
                  <div className="blog-item-meta">
                    <span className="category-tag">{blog.category}</span>
                    <span className="views">{blog.views} views</span>
                  </div>

                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>

                  <div className="blog-item-footer">
                    {/* FIXED AUTHOR LINE */}
                    <span className="author">{getAuthorName(blog.author)}</span>

                    {activeTab === "all" && (
                      <span className="likes">{blog.likes?.length || 0} likes</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {activeTab === "all" && category === "all" && totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BlogsPage
