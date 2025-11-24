import { useState } from 'react';

function UserProfilePage() {
  const [profile, setProfile] = useState({
    username: 'JohnDoe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    bio: 'Sports enthusiast and cricket fan',
    favoriteTeams: ['India', 'Mumbai Indians', 'Manchester United'],
    favoriteSports: ['cricket', 'football'],
    location: 'Mumbai, India',
    avatar: '👤'
  });

  const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...profile });

  const handleEdit = () => {
    setEditing(true);
    setTempProfile({ ...profile });
  };

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setEditing(false);
    // API call would go here
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setEditing(false);
  };

  const handleChange = (field, value) => {
    setTempProfile({ ...tempProfile, [field]: value });
  };

  return (
    <div className="profile-container">
      <style>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .profile-card {
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 3rem 2rem;
          text-align: center;
          color: white;
          position: relative;
        }

        .avatar-container {
          width: 120px;
          height: 120px;
          margin: 0 auto 1rem;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          border: 4px solid rgba(255,255,255,0.3);
        }

        .profile-name {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .profile-email {
          opacity: 0.9;
          font-size: 1rem;
        }

        .edit-button {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .edit-button:hover {
          background: white;
          color: #667eea;
        }

        .profile-body {
          padding: 2rem;
        }

        .section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .section:last-child {
          border-bottom: none;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          color: #4a5568;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          padding: 0.875rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input:disabled {
          background: #f7fafc;
          cursor: not-allowed;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
          font-family: inherit;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: #667eea;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tag-remove {
          background: rgba(255,255,255,0.3);
          border: none;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          transition: all 0.2s;
        }

        .tag-remove:hover {
          background: rgba(255,255,255,0.5);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .info-item {
          background: #f7fafc;
          padding: 1.25rem;
          border-radius: 0.75rem;
          border-left: 4px solid #667eea;
        }

        .info-label {
          font-size: 0.875rem;
          color: #718096;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a202c;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .btn {
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-primary:hover {
          background: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #4a5568;
        }

        .btn-secondary:hover {
          background: #cbd5e0;
        }

        .sports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }

        .sport-card {
          background: ${editing ? '#f7fafc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
          color: ${editing ? '#1a202c' : 'white'};
          padding: 1.5rem;
          border-radius: 0.75rem;
          text-align: center;
          font-weight: 600;
          cursor: ${editing ? 'pointer' : 'default'};
          border: ${editing ? '2px solid #e2e8f0' : 'none'};
          transition: all 0.2s;
        }

        .sport-card:hover {
          transform: ${editing ? 'translateY(-4px)' : 'none'};
          box-shadow: ${editing ? '0 8px 16px rgba(0,0,0,0.1)' : 'none'};
        }

        .sport-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .appointment-banner {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .appointment-text h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
        }

        .appointment-text p {
          margin: 0;
          opacity: 0.9;
        }

        .btn-appointment {
          background: white;
          color: #d97706;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-appointment:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 1rem;
          }

          .profile-header {
            padding: 2rem 1rem;
          }

          .edit-button {
            position: static;
            margin-top: 1rem;
            display: block;
            width: 100%;
          }

          .form-grid, .info-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .appointment-banner {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .btn-appointment {
            width: 100%;
          }
        }
      `}</style>

      <div className="profile-card">
        <div className="profile-header">
          {!editing && (
            <button className="edit-button" onClick={handleEdit}>
              ✏️ Edit Profile
            </button>
          )}
          <div className="avatar-container">{profile.avatar}</div>
          <h1 className="profile-name">{profile.username}</h1>
          <p className="profile-email">{profile.email}</p>
        </div>

        <div className="profile-body">
          <div className="appointment-banner">
            <div className="appointment-text">
              <h3>🎯 Book a Sports Consultant</h3>
              <p>Get expert guidance from professional coaches</p>
            </div>
            <button className="btn-appointment">
              Book Appointment
            </button>
          </div>

          <div className="section">
            <h2 className="section-title">
              📋 Personal Information
            </h2>
            {editing ? (
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={tempProfile.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={tempProfile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={tempProfile.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-input form-textarea"
                    value={tempProfile.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Username</div>
                  <div className="info-value">{profile.username}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Email</div>
                  <div className="info-value">{profile.email}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Phone</div>
                  <div className="info-value">{profile.phone}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Location</div>
                  <div className="info-value">{profile.location}</div>
                </div>
                <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                  <div className="info-label">Bio</div>
                  <div className="info-value">{profile.bio}</div>
                </div>
              </div>
            )}
          </div>

          <div className="section">
            <h2 className="section-title">
              ⚽ Favorite Sports
            </h2>
            <div className="sports-grid">
              <div className="sport-card">
                <div className="sport-icon">🏏</div>
                <div>Cricket</div>
              </div>
              <div className="sport-card">
                <div className="sport-icon">⚽</div>
                <div>Football</div>
              </div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">
              ❤️ Favorite Teams
            </h2>
            <div className="tags-container">
              {profile.favoriteTeams.map((team, index) => (
                <div key={index} className="tag">
                  {team}
                  {editing && (
                    <button className="tag-remove">×</button>
                  )}
                </div>
              ))}
              {editing && (
                <button className="tag" style={{ background: '#e2e8f0', color: '#4a5568' }}>
                  + Add Team
                </button>
              )}
            </div>
          </div>

          {editing && (
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                💾 Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;