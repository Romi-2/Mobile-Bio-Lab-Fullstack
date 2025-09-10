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

  // Validation functions
  const validateEmail = (email?: string) => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateMobile = (mobile?: string) => {
    if (!mobile) return false;
    const re = /^[0-9]{10,15}$/;
    return re.test(mobile);
  };

  const handleDownloadPDF = () => {
    if (!user) return;
    window.open(`http://localhost:5000/api/export/profile/${user.id}`, "_blank");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user?.profilePicture ? `http://localhost:5000${user.profilePicture}` : "/default-avatar.png"}
            alt="Profile"
            className="profile-avatar"
          />
          <p>{user?.role || "N/A"}</p>
        </div>

        <div className="profile-details">
          <h2>Personal Information</h2>

          <div className="detail-item">
            <span className="detail-label">First Name:</span>
            <span className="detail-value">{user?.firstName || "N/A"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Last Name:</span>
            <span className="detail-value">{user?.lastName || "N/A"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">VU ID:</span>
            <span className="detail-value">{user?.vu_id || "N/A"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Mobile:</span>
            <span className="detail-value">
              {user?.mobile ? (validateMobile(user.mobile) ? user.mobile : "Invalid mobile") : "N/A"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">
              {user?.email ? (validateEmail(user.email) ? user.email : "Invalid email") : "N/A"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Role:</span>
            <span className="detail-value">{user?.role || "N/A"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">City:</span>
            <span className="detail-value">{user?.city || "N/A"}</span>
          </div>

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
