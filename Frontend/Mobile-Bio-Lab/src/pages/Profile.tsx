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

      if (!userData) throw new Error("User data not found"); // Validation

      setUser(userData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching user data.");
      }
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDownloadPDF = () => {
    if (!user?.id) {
      setError("Cannot download PDF: User ID is missing.");
      return;
    }
    try {
      window.open(`http://localhost:5000/api/export/profile/${user.id}`, "_blank");
    } catch (err) {
      console.error("PDF download error:", err);
      setError("Failed to download PDF. Please try again.");
    }
  };

  // Helper: safe profile image URL
  const profileImageUrl = user?.profilePicture
    ? `http://localhost:5000/uploads/profilePics/${user.profilePicture}`
    : "/default-avatar.png";

  if (loading) return <div>Loading user profile...</div>;

  return (
    <div className="profile-container">
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={fetchUser}>Retry</button>
        </div>
      )}

      {user && (
        <div className="profile-card">
          <div className="profile-header">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="profile-avatar"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
            />
            <p>{user.role || "N/A"}</p>
          </div>

          <div className="profile-details">
            <h2>Personal Information</h2>

            <div className="detail-item">
              <span className="detail-label">First Name:</span>
              <span className="detail-value">{user.firstName || "N/A"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Last Name:</span>
              <span className="detail-value">{user.lastName || "N/A"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">VU ID:</span>
              <span className="detail-value">{user.vu_id || "N/A"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Mobile:</span>
              <span className="detail-value">{user.mobile || "N/A"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email || "N/A"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{user.role || "N/A"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">City:</span>
              <span className="detail-value">{user.city || "N/A"}</span>
            </div>

            <div className="profile-actions">
              <button className="pdf-button" onClick={handleDownloadPDF}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
