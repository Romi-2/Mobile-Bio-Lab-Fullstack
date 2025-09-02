// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import "../style/Profile.css";
import type { UserProfile } from "../services/userprofileservice";
import { getCurrentUser } from "../services/userprofileservice";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error: {error}. Please <a href="/login">login again</a>
      </div>
    );

  const handleDownloadPDF = () => {
  if (!user) return;
  // Match the route in profileExportRoute.js
  window.open(`http://localhost:5000/api/export/profile/${user.id}`, "_blank");
};

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
            <img
                src={
                  user?.profilePicture
                    ? `http://localhost:5000/uploads/${user.profilePicture}`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="profile-avatar"
              />

          <p>{user?.role}</p>
        </div>

        <div className="profile-details">
          <h2>Personal Information</h2>

          {user?.firstName && (
  <div className="detail-item">
    <span className="detail-label">First Name:</span>
    <span className="detail-value">{user.firstName}</span>
  </div>
)}
{user?.lastName && (
  <div className="detail-item">
    <span className="detail-label">Last Name:</span>
    <span className="detail-value">{user.lastName}</span>
  </div>
)}
{user?.vu_id && (
  <div className="detail-item">
    <span className="detail-label">VU ID:</span>
    <span className="detail-value">{user.vu_id}</span>
  </div>
)}
{user?.mobile && (
  <div className="detail-item">
    <span className="detail-label">Mobile:</span>
    <span className="detail-value">{user.mobile}</span>
  </div>
)}
{user?.email && (
  <div className="detail-item">
    <span className="detail-label">Email:</span>
    <span className="detail-value">{user.email}</span>
  </div>
)}
{user?.role && (
  <div className="detail-item">
    <span className="detail-label">Role:</span>
    <span className="detail-value">{user.role}</span>
  </div>
)}
{user?.city && (
  <div className="detail-item">
    <span className="detail-label">City:</span>
    <span className="detail-value">{user.city}</span>
  </div>

)}

          <div className="profile-actions">
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
