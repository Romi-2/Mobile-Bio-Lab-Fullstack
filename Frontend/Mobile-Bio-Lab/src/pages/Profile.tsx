// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import "../App.css";
import type { UserProfile } from "../services/userprofileservice";
import { getCurrentUser } from "../services/userprofileservice";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch currently logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Download profile as PDF
  const handleDownloadPDF = () => {
    if (!user) return;
    window.open(`http://localhost:5000/api/profile/export/${user.id}`, "_blank");
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="error-icon">⚠️</div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user?.profilePicture || "/default-avatar.png"}
            alt="Profile"
            className="profile-avatar"
          />
          <h1>{user?.firstName} {user?.lastName}</h1>
          <p>{user?.role}</p>
        </div>

        <div className="profile-details">
          <h2>Personal Information</h2>

          <div className="detail-row">
            {user?.firstName && <div className="detail-item"><span>First Name:</span> {user.firstName}</div>}
            {user?.lastName && <div className="detail-item"><span>Last Name:</span> {user.lastName}</div>}
          </div>

          {user?.studentVUId && (
            <div className="detail-item"><span>VU ID:</span> {user.studentVUId}</div>
          )}
          {user?.mobileNumber && (
            <div className="detail-item"><span>Mobile:</span> {user.mobileNumber}</div>
          )}

          <div className="detail-item"><span>Email:</span> {user?.vuEmailAddress || user?.email}</div>

          <div className="detail-row">
            <div className="detail-item"><span>Role:</span> {user?.role}</div>
            <div className="detail-item"><span>City:</span> {user?.city}</div>
          </div>

          <div className="profile-actions">
            <button className="edit-button">Edit Profile</button>
            <button className="pdf-button" onClick={handleDownloadPDF}>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
