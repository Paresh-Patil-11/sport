import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    appointments: 0,
    revenue: 0
  });
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        activeUsers: 892,
        appointments: 156,
        revenue: 45678
      });
      
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', joinDate: '2024-01-15', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', joinDate: '2024-02-20', status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'user', joinDate: '2024-03-10', status: 'inactive' },
      ]);
      
      setAppointments([
        { id: 1, userName: 'Sarah Wilson', type: 'Cricket Coaching', date: '2024-11-25', time: '10:00-11:00', status: 'pending' },
        { id: 2, userName: 'Tom Brown', type: 'Football Training', date: '2024-11-26', time: '14:00-15:00', status: 'confirmed' },
        { id: 3, userName: 'Emma Davis', type: 'Tennis Lessons', date: '2024-11-27', time: '09:00-10:00', status: 'pending' },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-icon" style={{ color }}>{icon}</div>
      <div className="stat-content">
        <h3>{value.toLocaleString()}</h3>
        <p>{title}</p>
      </div>
    </div>
  );

  const AppointmentItem = ({ appointment }) => (
    <div className="appointment-item">
      <div className="appointment-info">
        <h4>{appointment.userName}</h4>
        <p className="appointment-type">{appointment.type}</p>
        <p className="appointment-datetime">
          📅 {appointment.date} • 🕒 {appointment.time}
        </p>
      </div>
      <div className="appointment-actions">
        <span className={`status-badge ${appointment.status}`}>
          {appointment.status}
        </span>
        <button className="btn-icon" title="Confirm">✓</button>
        <button className="btn-icon" title="Cancel">✕</button>
      </div>
    </div>
  );

  const UserRow = ({ user }) => (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <span className="role-badge">{user.role}</span>
      </td>
      <td>{user.joinDate}</td>
      <td>
        <span className={`status-dot ${user.status}`}></span>
        {user.status}
      </td>
      <td>
        <button className="btn-small">View</button>
        <button className="btn-small btn-danger">Block</button>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-modern">
      <style>{`
        .admin-dashboard-modern {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .dashboard-header {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .dashboard-header h1 {
          font-size: 2rem;
          color: #1a202c;
          margin: 0 0 0.5rem 0;
        }

        .dashboard-header p {
          color: #718096;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .stat-icon {
          font-size: 2.5rem;
          opacity: 0.8;
        }

        .stat-content h3 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 0.25rem 0;
        }

        .stat-content p {
          color: #718096;
          font-size: 0.875rem;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dashboard-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          color: #4a5568;
        }

        .tab-btn.active {
          background: white;
          color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .tab-btn:hover {
          background: white;
          transform: translateY(-2px);
        }

        .content-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .content-card h2 {
          font-size: 1.5rem;
          color: #1a202c;
          margin: 0 0 1.5rem 0;
        }

        .appointments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .appointment-item {
          background: #f7fafc;
          border-radius: 0.75rem;
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }

        .appointment-item:hover {
          background: #edf2f7;
          transform: translateX(4px);
        }

        .appointment-info h4 {
          font-size: 1.125rem;
          color: #1a202c;
          margin: 0 0 0.5rem 0;
        }

        .appointment-type {
          color: #667eea;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          font-size: 0.875rem;
        }

        .appointment-datetime {
          color: #718096;
          font-size: 0.875rem;
          margin: 0;
        }

        .appointment-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .status-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.confirmed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }

        .btn-icon:nth-child(2) {
          background: #d1fae5;
          color: #065f46;
        }

        .btn-icon:nth-child(3) {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-icon:hover {
          transform: scale(1.1);
        }

        .users-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.5rem;
        }

        .users-table thead {
          background: #f7fafc;
        }

        .users-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #4a5568;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .users-table td {
          padding: 1rem;
          background: #f7fafc;
          color: #2d3748;
        }

        .users-table tr {
          transition: all 0.2s;
        }

        .users-table tbody tr:hover td {
          background: #edf2f7;
        }

        .users-table tbody tr td:first-child {
          border-top-left-radius: 0.5rem;
          border-bottom-left-radius: 0.5rem;
        }

        .users-table tbody tr td:last-child {
          border-top-right-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }

        .role-badge {
          background: #e0e7ff;
          color: #5850ec;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-dot {
          display: inline-block;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          margin-right: 0.5rem;
        }

        .status-dot.active {
          background: #10b981;
        }

        .status-dot.inactive {
          background: #ef4444;
        }

        .btn-small {
          padding: 0.375rem 0.75rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          margin-right: 0.5rem;
          transition: all 0.2s;
          background: #667eea;
          color: white;
        }

        .btn-small:hover {
          background: #5568d3;
          transform: translateY(-1px);
        }

        .btn-small.btn-danger {
          background: #ef4444;
        }

        .btn-small.btn-danger:hover {
          background: #dc2626;
        }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          color: white;
        }

        .spinner {
          width: 3rem;
          height: 3rem;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .admin-dashboard-modern {
            padding: 1rem;
          }

          .dashboard-header {
            padding: 1.5rem;
          }

          .dashboard-header h1 {
            font-size: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .appointment-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .appointment-actions {
            width: 100%;
            justify-content: space-between;
          }

          .users-table {
            font-size: 0.875rem;
          }

          .users-table th,
          .users-table td {
            padding: 0.75rem 0.5rem;
          }
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="dashboard-header">
        <h1>🏆 Owner Dashboard</h1>
        <p>Welcome back! Here's what's happening with your sports platform today.</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="#667eea" />
        <StatCard title="Active Users" value={stats.activeUsers} icon="⚡" color="#10b981" />
        <StatCard title="Appointments" value={stats.appointments} icon="📅" color="#f59e0b" />
        <StatCard title="Revenue" value={`$${stats.revenue}`} icon="💰" color="#ef4444" />
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          📅 Appointments
        </button>
        <button 
          className={`tab-btn ${activeTab === 'consultants' ? 'active' : ''}`}
          onClick={() => setActiveTab('consultants')}
        >
          🎓 Consultants
        </button>
      </div>

      {activeTab === 'appointments' && (
        <div className="content-card">
          <h2>Sport Consultant Appointments</h2>
          <div className="appointments-list">
            {appointments.map(appointment => (
              <AppointmentItem key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="content-card">
          <h2>User Management</h2>
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'consultants' && (
        <div className="content-card">
          <h2>Sports Consultants</h2>
          <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
            Manage your sports coaching and consulting team
          </p>
          <button className="btn-primary" style={{
            background: '#667eea',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            + Add New Consultant
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;