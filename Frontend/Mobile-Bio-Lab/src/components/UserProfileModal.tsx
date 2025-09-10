import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type UserProfile } from "../services/userprofileservice";
import { adminUpdateUser } from "../services/updateprofileservice";
import "../style/UserProfileModal.css";

interface Props {
  user: UserProfile;
  onUpdated: () => void;
}

const UserProfileForm: React.FC<Props> = ({ user, onUpdated }) => {
  const [email, setEmail] = useState(user.email || "");
  const [city, setCity] = useState(user.city || "");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user.profilePicture || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setEmail(user.email || "");
    setCity(user.city || "");
    setPreviewUrl(user.profilePicture || "");
    setProfileFile(null);
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    if (file.size > 200 * 1024) {
      alert("File size must be less than 200KB.");
      return;
    }

    setProfileFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const validateInputs = (): boolean => {
    const trimmedEmail = email.trim();
    const trimmedCity = city.trim();

    if (!trimmedEmail) {
      setMessage({ text: "❌ Email is required.", type: "error" });
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setMessage({ text: "❌ Invalid email format.", type: "error" });
      return false;
    }

    // City validation (optional)
    if (trimmedCity && !/^[a-zA-Z\s,]+$/.test(trimmedCity)) {
      setMessage({ text: "❌ City can only contain letters, commas, and spaces.", type: "error" });
      return false;
    }

    if (trimmedCity.length > 100) {
      setMessage({ text: "❌ City name is too long.", type: "error" });
      return false;
    }

    setMessage(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    const userId = Number(user?.id);
    if (!user || isNaN(userId)) {
      setMessage({ text: "❌ User ID is missing!", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("city", city.trim());
    if (profileFile) formData.append("profilePicture", profileFile);

    setLoading(true);
    try {
      await adminUpdateUser(userId, formData);
      setMessage({ text: "✅ Profile successfully updated!", type: "success" });
      onUpdated();
    } catch (error) {
      console.error(error);
      setMessage({ text: "❌ Failed to update profile", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000); // auto-hide
    }
  };

  return (
    <div className="profile-container">
      {message && (
        <div className={`dropdown-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-card">
        <h3>Admin Edit User Profile</h3>

        {previewUrl && (
          <div className="passport-photo">
            <img src={previewUrl} alt="Preview" className="preview-img" />
          </div>
        )}

        <label>VU Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>City:</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />

        <label>Profile Picture (Passport Size):</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <div className="actions">
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={() => navigate(-1)} className="back-button">
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
