// src/components/UserProfile/UserProfileForm.tsx
import React, { useState, useEffect } from "react";
import { updateUserProfile, type UserProfile } from "../../services/userprofileservice";
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
        // Standard passport photo ~ 300x400px (can allow a little tolerance)
        if (img.width < 250 || img.height < 350 || img.width > 350 || img.height > 450) {
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
    if (!email || !city) {
      alert("VU Email and City are required!");
      return;
    }

    const formData = new FormData();
    formData.append("vuEmail", email);
    formData.append("city", city);
    if (profileFile) formData.append("profilePicture", profileFile);

    setLoading(true);
    try {
      await updateUserProfile(user.id, formData);
      alert("User profile updated!");
      onUpdated();
    } catch (error) {
      console.error(error);
      alert("Failed to update user profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h3>Edit User Profile</h3>

        <label>VU Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>City:</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />

        <label>Profile Picture (Passport Size):</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" className="preview-img" />}

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
