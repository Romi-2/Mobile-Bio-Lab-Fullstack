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
      if (!userData) throw new Error("User data not found");
      setUser(userData);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred while fetching user data.");
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

  const profileImageUrl = user?.profilePicture
    ? `http://localhost:5000${user.profilePicture}`
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
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
            />
            <p>{user.role || "N/A"}</p>
          </div>

          <div className="profile-details">
            <h2>Personal Information</h2>
            {[
              ["First Name", user.firstName],
              ["Last Name", user.lastName],
              ["VU ID", user.vu_id],
              ["Mobile", user.mobile],
              ["Email", user.email],
              ["Role", user.role],
              ["City", user.city],
            ].map(([label, value]) => (
              <div className="detail-item" key={label}>
                <span className="detail-label">{label}:</span>
                <span className="detail-value">{value || "N/A"}</span>
              </div>
            ))}

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
