"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import "./AdminDashboard.css"

function AdminDashboard() {
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [users, setUsers] = useState([])
  const [pendingBlogs, setPendingBlogs] = useState([])
  const [thirdPartyBlogs, setThirdPartyBlogs] = useState([])
  const [thirdPartyStats, setThirdPartyStats] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard")
      return
    }

    const fetchDashboard = async () => {
      try {
        const [statsRes, usersRes, blogsRes, thirdPartyRes, statsRes2] = await Promise.all([
          axios.get("/api/admin/stats/overview", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/blogs/pending/review", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/third-party-blogs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/third-party-blogs/stats/by-source", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        setDashboard(statsRes.data)
        setUsers(usersRes.data.users)
        setPendingBlogs(blogsRes.data)
        setThirdPartyBlogs(thirdPartyRes.data.blogs)
        setThirdPartyStats(statsRes2.data)
      } catch (err) {
        console.error("Error fetching admin data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [user?.role, token, navigate])

  const approveBlog = async (blogId) => {
    try {
      await axios.patch(
        `/api/admin/blogs/${blogId}/status`,
        { published: true },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setPendingBlogs(pendingBlogs.filter((b) => b._id !== blogId))
    } catch (err) {
      console.error("Error approving blog:", err)
    }
  }

  const rejectBlog = async (blogId) => {
    try {
      await axios.delete(`/api/admin/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPendingBlogs(pendingBlogs.filter((b) => b._id !== blogId))
    } catch (err) {
      console.error("Error rejecting blog:", err)
    }
  }

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.patch(
        `/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)))
    } catch (err) {
      console.error("Error updating user role:", err)
    }
  }

  const fetchFromSource = async (source) => {
    try {
      setFetching(true)
      const endpoint =
        source === "all" ? "/api/admin/third-party-blogs/fetch/all" : `/api/admin/third-party-blogs/fetch/${source}`

      const res = await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } })

      // Refresh third-party blogs
      const blogsRes = await axios.get("/api/admin/third-party-blogs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setThirdPartyBlogs(blogsRes.data.blogs)

      alert(`${res.data.totalFetched || res.data.count} blogs fetched successfully!`)
    } catch (err) {
      console.error("Error fetching blogs:", err)
      alert("Error fetching blogs")
    } finally {
      setFetching(false)
    }
  }

  const deleteThirdPartyBlog = async (blogId) => {
    try {
      await axios.delete(`/api/admin/third-party-blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setThirdPartyBlogs(thirdPartyBlogs.filter((b) => b._id !== blogId))
    } catch (err) {
      console.error("Error deleting blog:", err)
    }
  }

  if (loading) return <div className="container mt-4">Loading admin dashboard...</div>
  if (!dashboard) return <div className="container mt-4">Error loading dashboard</div>

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage content, users, and platform activity</p>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button className={`tab ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            Users
          </button>
          <button className={`tab ${activeTab === "blogs" ? "active" : ""}`} onClick={() => setActiveTab("blogs")}>
            Pending Blogs
          </button>
          <button
            className={`tab ${activeTab === "third-party" ? "active" : ""}`}
            onClick={() => setActiveTab("third-party")}
          >
            Third-Party Blogs
          </button>
        </div>

        <div className="admin-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{dashboard.stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
                <div className="stat-card">
                  <h3>{dashboard.stats.totalBlogs}</h3>
                  <p>Total Blogs</p>
                </div>
                <div className="stat-card">
                  <h3>{dashboard.stats.publishedBlogs}</h3>
                  <p>Published Blogs</p>
                </div>
                <div className="stat-card">
                  <h3>{dashboard.stats.unpublishedBlogs}</h3>
                  <p>Pending Review</p>
                </div>
                <div className="stat-card">
                  <h3>{dashboard.stats.activeUsers}</h3>
                  <p>Active (7 days)</p>
                </div>
                <div className="stat-card">
                  <h3>{dashboard.stats.totalMatches}</h3>
                  <p>Total Matches</p>
                </div>
                <div className="stat-card">
                  <h3>{dashboard.stats.thirdPartyBlogs}</h3>
                  <p>Third-Party Blogs</p>
                </div>
              </div>

              <div className="recent-section">
                <h2>Recent Blogs</h2>
                <div className="recent-list">
                  {dashboard.recentBlogs.map((blog) => (
                    <div key={blog._id} className="recent-item">
                      <h4>{blog.title}</h4>
                      <div className="recent-meta">
                        <span>{blog.author.username}</span>
                        <span>{blog.views} views</span>
                        <span className={`status ${blog.published ? "published" : "draft"}`}>
                          {blog.published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "third-party" && (
            <div className="third-party-tab">
              <h2>Third-Party Blog Management</h2>

              <div className="fetch-section">
                <h3>Fetch Blogs from External Sources</h3>
                <div className="fetch-buttons">
                  <button className="btn btn-primary" onClick={() => fetchFromSource("devto")} disabled={fetching}>
                    {fetching ? "Fetching..." : "Fetch from Dev.to"}
                  </button>
                  <button className="btn btn-primary" onClick={() => fetchFromSource("medium")} disabled={fetching}>
                    {fetching ? "Fetching..." : "Fetch from Medium"}
                  </button>
                  <button className="btn btn-primary" onClick={() => fetchFromSource("hashnode")} disabled={fetching}>
                    {fetching ? "Fetching..." : "Fetch from Hashnode"}
                  </button>
                  <button className="btn btn-success" onClick={() => fetchFromSource("all")} disabled={fetching}>
                    {fetching ? "Fetching..." : "Fetch All Sources"}
                  </button>
                </div>
              </div>

              {thirdPartyStats.length > 0 && (
                <div className="stats-section">
                  <h3>Blogs by Source</h3>
                  <div className="source-stats">
                    {thirdPartyStats.map((stat) => (
                      <div key={stat._id} className="source-stat-card">
                        <h4>{stat._id}</h4>
                        <p>Blogs: {stat.count}</p>
                        <p>Avg Views: {Math.round(stat.avgViews)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="blogs-section">
                <h3>Fetched Blogs ({thirdPartyBlogs.length})</h3>
                {thirdPartyBlogs.length === 0 ? (
                  <div className="empty-state">
                    <p>No third-party blogs fetched yet</p>
                  </div>
                ) : (
                  <div className="third-party-blogs-list">
                    {thirdPartyBlogs.map((blog) => (
                      <div key={blog._id} className="third-party-item">
                        <div className="third-party-content">
                          <h4>{blog.title}</h4>
                          <p className="source-info">
                            <span className="source-badge">{blog.source}</span>
                            <span>{blog.author}</span>
                          </p>
                          <p className="excerpt">{blog.excerpt}</p>
                          <div className="blog-meta">
                            <span>{blog.views} views</span>
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="third-party-actions">
                          <a href={blog.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-small">
                            View
                          </a>
                          <button className="btn btn-outline" onClick={() => deleteThirdPartyBlog(blog._id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="users-tab">
              <h2>Users Management</h2>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user._id, e.target.value)}
                            className="role-select"
                          >
                            <option value="user">User</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="btn-small">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "blogs" && (
            <div className="blogs-tab">
              <h2>Pending Blogs ({pendingBlogs.length})</h2>
              {pendingBlogs.length === 0 ? (
                <div className="empty-state">
                  <p>No pending blogs for review</p>
                </div>
              ) : (
                <div className="pending-blogs">
                  {pendingBlogs.map((blog) => (
                    <div key={blog._id} className="pending-item">
                      <div className="pending-content">
                        <h3>{blog.title}</h3>
                        <p className="excerpt">{blog.excerpt}</p>
                        <div className="pending-meta">
                          <span>By {blog.author.username}</span>
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="pending-actions">
                        <button className="btn btn-primary" onClick={() => approveBlog(blog._id)}>
                          Approve
                        </button>
                        <button className="btn btn-outline" onClick={() => rejectBlog(blog._id)}>
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
