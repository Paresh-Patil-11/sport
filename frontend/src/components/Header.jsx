"use client"

import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import "./Header.css"

function Header() {
  const { user, logout } = useContext(AuthContext)

  return (
    <header className="header">
      <div className="container flex-between">
        <div className="logo">
          <Link to="/">SportsHub</Link>
        </div>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/blogs">Blogs</Link>
          <a href="#scores">Live Scores</a>
          <a href="#sports">Sports</a>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="user-profile">
                {user.username}
              </Link>
              <button onClick={logout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
