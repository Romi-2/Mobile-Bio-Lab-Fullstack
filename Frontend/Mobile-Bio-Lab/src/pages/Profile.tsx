// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import "../App.css";
import type { UserProfile } from "../services/userprofileservice";
import { getCurrentUser } from "../services/userprofileservice"; // <-- import UserProfile type
const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null); // ✅ typed state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Profile fetch error:", err);
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}. Please <a href="/login">login again</a></div>;

  // Download profile as PDF
  const handleDownloadPDF = () => {
    if (!user) return;
    window.open(`http://localhost:5000/api/profile/export/${user.id}`, "_blank");
  };

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
            {user?.firstName && (
              <div className="detail-item"><span>First Name:</span> {user.firstName}</div>
            )}
            {user?.lastName && (
              <div className="detail-item"><span>Last Name:</span> {user.lastName}</div>
            )}
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
