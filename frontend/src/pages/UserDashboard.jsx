"use client"

import { useContext, useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import "./UserDashboard.css"

function UserDashboard() {
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("blogs")

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`/api/users/${user?.id}/activity`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setDashboard(res.data)
      } catch (err) {
        console.error("Error fetching dashboard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [user?.id, token, navigate])

  if (loading) return <div className="container mt-4">Loading dashboard...</div>
  if (!dashboard) return <div className="container mt-4">Error loading dashboard</div>

  return (
    <div className="user-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {dashboard.user.username}!</h1>
          <p>Your personal sports hub</p>
        </div>

        <div className="dashboard-tabs">
          <button className={`tab ${activeTab === "blogs" ? "active" : ""}`} onClick={() => setActiveTab("blogs")}>
            My Blogs
          </button>
          <button className={`tab ${activeTab === "liked" ? "active" : ""}`} onClick={() => setActiveTab("liked")}>
            Liked Posts
          </button>
          <button className={`tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
            Profile Settings
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === "blogs" && (
            <div className="blogs-tab">
              <div className="tab-header">
                <h2>My Blogs</h2>
                <Link to="/create-blog" className="btn btn-primary">
                  New Blog
                </Link>
              </div>

              {dashboard.myBlogs.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't written any blogs yet</p>
                  <Link to="/create-blog" className="btn btn-secondary">
                    Create Your First Blog
                  </Link>
                </div>
              ) : (
                <div className="blogs-list">
                  {dashboard.myBlogs.map((blog) => (
                    <div key={blog._id} className="blog-item">
                      <div className="blog-item-main">
                        <h3>{blog.title}</h3>
                        <div className="blog-item-meta">
                          <span className={`status ${blog.published ? "published" : "draft"}`}>
                            {blog.published ? "Published" : "Draft"}
                          </span>
                          <span>{blog.views} views</span>
                          <span>{blog.likes.length} likes</span>
                        </div>
                      </div>
                      <div className="blog-item-actions">
                        <Link to={`/blog/${blog.slug}`} className="btn btn-outline">
                          View
                        </Link>
                        <button className="btn btn-outline">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "liked" && (
            <div className="liked-tab">
              <h2>Blogs You've Liked</h2>
              {dashboard.likedBlogs.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't liked any blogs yet</p>
                </div>
              ) : (
                <div className="liked-list">
                  {dashboard.likedBlogs.map((blog) => (
                    <Link key={blog._id} to={`/blog/${blog.slug}`} className="liked-item">
                      <h4>{blog.title}</h4>
                      <p>by {blog.author.username}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="profile-tab">
              <h2>Profile Settings</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" defaultValue={dashboard.user.username} disabled />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue={dashboard.user.email} disabled />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" defaultValue={dashboard.user.role} disabled />
                </div>
                <p className="info-text">Contact support to change your profile details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
