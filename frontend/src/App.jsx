// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import BlogsPage from "./pages/BlogsPage"
import BlogDetailPage from "./pages/BlogDetailPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import UserDashboard from "./pages/UserDashboard"
import UserProfilePage from "./pages/UserProfilePage"
import LiveMatchPage from "./pages/LiveMatchPage"
import AdminDashboard from "./pages/AdminDashboard"
import SportsPage from "./pages/SportsPage"
import AppointmentPage from "./pages/AppointmentPage"

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/profile/:userId" element={<UserProfilePage />} />
            <Route path="/live-scores" element={<LiveMatchPage />} />
            <Route path="/sports" element={<SportsPage />} />
            <Route path="/appointments" element={<AppointmentPage />} />
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