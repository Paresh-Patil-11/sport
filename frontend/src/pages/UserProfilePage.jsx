"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import "./UserProfilePage.css"

function UserProfilePage() {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("about")
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`)
        setProfile(res.data)
        setIsFollowing(res.data.user.followers?.some((f) => f._id === userId))
      } catch (err) {
        console.error("Error fetching profile:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(`/api/users/${userId}/follow`, {}, { headers: { Authorization: `Bearer ${token}` } })
      setIsFollowing(res.data.isFollowing)
    } catch (err) {
      console.error("Error following user:", err)
    }
  }

  if (loading) return <div className="container mt-4">Loading profile...</div>
  if (!profile) return <div className="container mt-4">User not found</div>

  const { user, stats, recentBlogs } = profile

  return (
    <div className="user-profile-page">
      {/* Profile Header */}
      <section
        className="profile-header"
        style={{
          background: `linear-gradient(135deg, var(--primary-blue) 0%, #053d7a 100%)`,
        }}
      >
        <div className="container">
          <div className="profile-top">
            <div className="profile-info">
              <div className="avatar-large">
                <img src={user.avatar || "https://via.placeholder.com/120"} alt={user.username} />
              </div>
              <div className="user-details">
                <h1>{user.username}</h1>
                <p className="role-badge">{user.role.toUpperCase()}</p>
                {user.bio && <p className="bio">{user.bio}</p>}
              </div>
            </div>
            <button className={`btn ${isFollowing ? "btn-outline" : "btn-secondary"}`} onClick={handleFollow}>
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{stats.blogs}</span>
              <span className="stat-label">Blogs</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.following}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.totalViews}</span>
              <span className="stat-label">Total Views</span>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="profile-content">
        <div className="container">
          <div className="tabs">
            <button className={`tab ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>
              About
            </button>
            <button className={`tab ${activeTab === "blogs" ? "active" : ""}`} onClick={() => setActiveTab("blogs")}>
              Blogs ({stats.blogs})
            </button>
            <button
              className={`tab ${activeTab === "followers" ? "active" : ""}`}
              onClick={() => setActiveTab("followers")}
            >
              Followers ({stats.followers})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "about" && (
              <div className="about-section">
                <div className="about-grid">
                  <div className="about-item">
                    <h3>Email</h3>
                    <p>{user.email}</p>
                  </div>
                  <div className="about-item">
                    <h3>Member Since</h3>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  {user.favoriteTeams && user.favoriteTeams.length > 0 && (
                    <div className="about-item">
                      <h3>Favorite Teams</h3>
                      <div className="team-tags">
                        {user.favoriteTeams.map((team, idx) => (
                          <span key={idx} className="team-tag">
                            {team}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "blogs" && (
              <div className="blogs-section">
                {recentBlogs.length === 0 ? (
                  <p className="empty">No blogs yet</p>
                ) : (
                  <div className="recent-blogs">
                    {recentBlogs.map((blog) => (
                      <Link key={blog._id} to={`/blog/${blog.slug}`} className="blog-preview">
                        <h4>{blog.title}</h4>
                        <div className="blog-preview-meta">
                          <span>{blog.views} views</span>
                          <span>{blog.likes.length} likes</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "followers" && (
              <div className="followers-section">
                {stats.followers === 0 ? (
                  <p className="empty">No followers yet</p>
                ) : (
                  <div className="followers-grid">
                    {user.followers?.map((follower) => (
                      <Link key={follower._id} to={`/profile/${follower._id}`} className="follower-card">
                        <img src={follower.avatar || "https://via.placeholder.com/80"} alt={follower.username} />
                        <h5>{follower.username}</h5>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserProfilePage
