// src/components/UserProfile/UserProfileModal.tsx
import React, { useState, useEffect } from "react";
import { type UserProfile } from "../../services/userprofileservice";
import { adminUpdateUser } from "../../services/updateprofileservice"; // ✅ only keep this
import "./UserProfileModal.css";

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

  useEffect(() => {
    setEmail(user.email || "");
    setCity(user.city || "");
    setPreviewUrl(user.profilePicture || "");
    setProfileFile(null);
  }, [user]);

  const validatePassportPhoto = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        return resolve(false);
      }

      if (file.size > 200 * 1024) {
        alert("File size must be less than 200KB.");
        return resolve(false);
      }

      const img = new Image();
      img.onload = () => {
        if (
          img.width < 250 ||
          img.height < 350 ||
          img.width > 350 ||
          img.height > 450
        ) {
          alert("Passport photo must be approx 300x400px.");
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValid = await validatePassportPhoto(file);
      if (!isValid) {
        e.target.value = ""; // reset input
        return;
      }
      setProfileFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const userId = Number(user?.id);
if (!user || isNaN(userId)) {
  console.error("User ID is missing or invalid. User object:", user);
  alert("Something went wrong: user ID is missing.");
  return;
}


    const formData = new FormData();
    formData.append("email", email);
    formData.append("city", city);
    if (profileFile) formData.append("profilePicture", profileFile);

    setLoading(true);
    try {
      await adminUpdateUser(userId, formData); // ✅ Only admin updates
      console.log("✅ Admin updated user:", userId);
      onUpdated();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h3>Admin Edit User Profile</h3>

        {previewUrl && (
          <div className="passport-photo">
            <img src={previewUrl} alt="Preview" className="preview-img" />
          </div>
        )}

        <label>VU Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>City:</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <label>Profile Picture (Passport Size):</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <div className="actions">
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
