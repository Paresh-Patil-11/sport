// frontend/src/pages/AppointmentPage.jsx
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"

function AppointmentPage() {
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    consultantType: "",
    appointmentDate: "",
    timeSlot: "",
    notes: "",
    userDetails: {
      name: "",
      email: "",
      phone: ""
    }
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const consultants = [
    {
      type: "cricket",
      name: "Cricket Coaching",
      icon: "🏏",
      color: "from-green-500 to-emerald-600",
      description: "Professional cricket coaching for all skill levels",
      features: ["Batting Techniques", "Bowling Mastery", "Fielding Skills", "Match Strategy"]
    },
    {
      type: "football",
      name: "Football Training",
      icon: "⚽",
      color: "from-blue-500 to-indigo-600",
      description: "Expert football training and tactical guidance",
      features: ["Dribbling Skills", "Shooting Practice", "Team Tactics", "Fitness Training"]
    },
    {
      type: "tennis",
      name: "Tennis Lessons",
      icon: "🎾",
      color: "from-yellow-500 to-orange-600",
      description: "One-on-one tennis coaching sessions",
      features: ["Serve Technique", "Forehand/Backhand", "Court Movement", "Match Play"]
    },
    {
      type: "fitness",
      name: "Sports Fitness",
      icon: "💪",
      color: "from-purple-500 to-pink-600",
      description: "Comprehensive fitness training for athletes",
      features: ["Strength Training", "Cardio Workouts", "Flexibility", "Nutrition Advice"]
    }
  ]

  const timeSlots = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
    "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"
  ]

  // Check if user is logged in before allowing form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Redirect to login if not authenticated
    if (!user || !token) {
      alert("Please login to book an appointment")
      navigate("/login", { state: { from: "/appointments" } })
      return
    }

    setLoading(true)

    try {
      await axios.post("/api/appointments", formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess(true)
      setTimeout(() => {
        navigate("/dashboard")
      }, 2000)
    } catch (err) {
      alert("Failed to book appointment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle consultant selection
  const handleConsultantSelect = (consultantType) => {
    // If not logged in, show login prompt
    if (!user) {
      const confirmLogin = window.confirm(
        "You need to login to book an appointment. Would you like to login now?"
      )
      if (confirmLogin) {
        navigate("/login", { state: { from: "/appointments" } })
      }
      return
    }
    
    // If logged in, allow selection
    setFormData({ ...formData, consultantType })
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Appointment Booked!</h2>
          <p className="text-gray-600 mb-6">Your appointment has been successfully scheduled</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Book a Sports Consultant
          </h1>
          <p className="text-xl text-gray-600">
            Get expert guidance from professional coaches and trainers
          </p>
          {!user && (
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 max-w-2xl mx-auto">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <span className="font-semibold">Login Required:</span> You need to{" "}
                    <button 
                      onClick={() => navigate("/login", { state: { from: "/appointments" } })}
                      className="underline font-semibold hover:text-yellow-900"
                    >
                      login
                    </button>
                    {" "}or{" "}
                    <button 
                      onClick={() => navigate("/register", { state: { from: "/appointments" } })}
                      className="underline font-semibold hover:text-yellow-900"
                    >
                      create an account
                    </button>
                    {" "}to book an appointment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Consultants Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {consultants.map((consultant) => (
            <div
              key={consultant.type}
              onClick={() => handleConsultantSelect(consultant.type)}
              className={`cursor-pointer rounded-xl p-6 transition-all duration-300 transform hover:-translate-y-2 ${
                formData.consultantType === consultant.type
                  ? `bg-gradient-to-br ${consultant.color} text-white shadow-2xl scale-105`
                  : 'bg-white hover:shadow-xl'
              }`}
            >
              <div className="text-5xl mb-4 text-center">{consultant.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-center">{consultant.name}</h3>
              <p className={`text-sm mb-4 text-center ${formData.consultantType === consultant.type ? 'text-white' : 'text-gray-600'}`}>
                {consultant.description}
              </p>
              <ul className="space-y-2">
                {consultant.features.map((feature, index) => (
                  <li key={index} className={`text-sm flex items-center gap-2 ${formData.consultantType === consultant.type ? 'text-white' : 'text-gray-600'}`}>
                    <span>✓</span> {feature}
                  </li>
                ))}
              </ul>
              {!user && formData.consultantType === consultant.type && (
                <div className="mt-4 text-center text-sm opacity-90">
                  Please login to continue
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Booking Form - Only show if consultant is selected and user is logged in */}
        {formData.consultantType && user && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Booking</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.userDetails.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      userDetails: { ...formData.userDetails, name: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.userDetails.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      userDetails: { ...formData.userDetails, email: e.target.value }
                    })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.userDetails.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    userDetails: { ...formData.userDetails, phone: e.target.value }
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  placeholder="+1 234 567 8900"
                />
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Slot *
                  </label>
                  <select
                    required
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  >
                    <option value="">Select a time slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  placeholder="Any specific requirements or questions..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Booking..." : "Confirm Appointment"}
              </button>
            </form>
          </div>
        )}

        {/* Show login prompt if consultant selected but not logged in */}
        {formData.consultantType && !user && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please login or create an account to complete your booking
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/login", { state: { from: "/appointments" } })}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register", { state: { from: "/appointments" } })}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {!formData.consultantType && (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-lg">👆 Select a consultant type above to continue</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentPage