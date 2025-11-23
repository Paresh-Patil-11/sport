import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import BlogsPage from "./pages/BlogsPage"
import BlogDetailPage from "./pages/BlogDetailPage"
import ThirdPartyBlogDetailPage from "./pages/ThirdPartyBlogDetailPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import UserDashboard from "./pages/UserDashboard"
import UserProfilePage from "./pages/UserProfilePage"
import LiveMatchPage from "./pages/LiveMatchPage"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/third-party-blog/:slug" element={<ThirdPartyBlogDetailPage />} />
            <Route path="/profile/:userId" element={<UserProfilePage />} />
            <Route path="/live/:matchId" element={<LiveMatchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
