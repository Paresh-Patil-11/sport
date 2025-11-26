// frontend/src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"

function Header() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ⚽ SportsHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/blogs" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Blogs
            </Link>
            <Link 
              to="/live-scores" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Live Scores
            </Link>
            <Link 
              to="/sports" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Sports
            </Link>
            {/* Always show Appointments link */}
            <Link 
              to="/appointments" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Appointments
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors duration-200"
                >
                  👤 {user.username}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium"
              >
                Home
              </Link>
              <Link 
                to="/blogs" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium"
              >
                Blogs
              </Link>
              <Link 
                to="/live-scores" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium"
              >
                Live Scores
              </Link>
              <Link 
                to="/sports" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium"
              >
                Sports
              </Link>
              {/* Always show Appointments in mobile menu */}
              <Link 
                to="/appointments" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium"
              >
                Appointments
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium"
                  >
                    👤 {user.username}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header