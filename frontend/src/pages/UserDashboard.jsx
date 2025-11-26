// frontend/src/pages/UserDashboard.jsx
import { useContext, useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"

function UserDashboard() {
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("profile")
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/appointments/my-appointments", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAppointments(res.data || [])
      } catch (err) {
        console.error("Error fetching appointments:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [user?.id, token, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-blue-100">
            Manage your profile and appointments
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            👤 My Profile
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
              activeTab === "appointments"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📅 My Appointments
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
              <Link
                to={`/profile/${user?.id}`}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                ✏️ Edit Profile
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-sm text-gray-500 mb-2">Username</div>
                <div className="text-lg font-semibold text-gray-800">{user?.username}</div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-sm text-gray-500 mb-2">Email</div>
                <div className="text-lg font-semibold text-gray-800">{user?.email}</div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-sm text-gray-500 mb-2">Role</div>
                <div className="text-lg font-semibold text-gray-800 capitalize">{user?.role}</div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-sm text-gray-500 mb-2">Member Since</div>
                <div className="text-lg font-semibold text-gray-800">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/appointments"
                  className="flex items-center gap-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <div className="text-4xl">📅</div>
                  <div>
                    <div className="font-bold text-lg">Book Appointment</div>
                    <div className="text-sm opacity-90">Schedule a consultation</div>
                  </div>
                </Link>

                <Link
                  to="/blogs"
                  className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <div className="text-4xl">📰</div>
                  <div>
                    <div className="font-bold text-lg">Read Blogs</div>
                    <div className="text-sm opacity-90">Explore sports content</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                My Appointments ({appointments.length})
              </h2>
              <Link
                to="/appointments"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                + New Appointment
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments Yet</h3>
                <p className="text-gray-600 mb-6">Book your first consultation with our sports experts</p>
                <Link
                  to="/appointments"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Book Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const statusColors = {
                    pending: "bg-yellow-100 text-yellow-800",
                    confirmed: "bg-green-100 text-green-800",
                    cancelled: "bg-red-100 text-red-800",
                    completed: "bg-blue-100 text-blue-800"
                  }

                  const consultantIcons = {
                    cricket: "🏏",
                    football: "⚽",
                    tennis: "🎾",
                    fitness: "💪"
                  }

                  return (
                    <div key={appointment._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{consultantIcons[appointment.consultantType] || "📋"}</div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 capitalize">
                              {appointment.consultantType} Consultation
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.userDetails?.name || "N/A"}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[appointment.status] || statusColors.pending}`}>
                          {appointment.status?.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>📅</span>
                          <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>🕐</span>
                          <span>{appointment.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>📧</span>
                          <span>{appointment.userDetails?.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>📱</span>
                          <span>{appointment.userDetails?.phone || "N/A"}</span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm font-semibold text-gray-700 mb-1">Notes:</div>
                          <div className="text-sm text-gray-600">{appointment.notes}</div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard