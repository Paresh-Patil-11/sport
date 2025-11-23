"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "./ThirdPartyBlogDetailPage.css"

function ThirdPartyBlogDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [rawData, setRawData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRawData, setShowRawData] = useState(false)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/third-party-blogs/blog/${slug}`)
        setBlog(res.data)

        // Fetch raw data
        const rawRes = await axios.get(`/api/third-party-blogs/raw/${slug}`)
        setRawData(rawRes.data.rawData)
      } catch (err) {
        setError(err.response?.data?.message || "Blog not found")
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [slug])

  if (loading) return <div className="container mt-4">Loading...</div>
  if (error) return <div className="container mt-4 error-message">{error}</div>
  if (!blog) return <div className="container mt-4">Blog not found</div>

  return (
    <article className="third-party-blog-detail">
      <div className="container">
        <div className="blog-detail-header">
          <div className="source-info">
            <span className="source-badge">{blog.source}</span>
            <a href={blog.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
              View on {blog.source}
            </a>
          </div>

          <h1>{blog.title}</h1>

          <div className="blog-meta">
            <div className="author-info">
              <div>
                <p className="author-name">{blog.author}</p>
                <p className="publish-date">{new Date(blog.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="blog-stats">
              <span>{blog.views} views</span>
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
          </div>

          <div className="raw-data-section">
            <button className="toggle-raw-data" onClick={() => setShowRawData(!showRawData)}>
              {showRawData ? "Hide Raw Data" : "Show Raw Data"}
            </button>

            {showRawData && rawData && (
              <div className="raw-data-container">
                <h3>Raw API Response</h3>
                <pre>{JSON.stringify(rawData, null, 2)}</pre>
              </div>
            )}
          </div>

          <div className="back-link">
            <button onClick={() => navigate("/blogs")}>← Back to Blogs</button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ThirdPartyBlogDetailPage
