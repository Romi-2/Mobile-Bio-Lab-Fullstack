import React, { useState, useEffect } from "react";
import { updateUserProfile, type UserProfile } from "../../services/userprofileservice";
import "./UserProfileModal.css";

interface Props {
  user: UserProfile | null;
  onClose: () => void;
  onUpdated: () => void;
}

const UserProfileModal: React.FC<Props> = ({ user, onClose, onUpdated }) => {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setCity(user.city);
      setPreviewUrl(user.profilePicture || "");
    }
  }, [user]);

  if (!user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("city", city);
      if (profileFile) formData.append("profilePic", profileFile);

      await updateUserProfile(user.id, formData);
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit User Profile</h3>

        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>City:</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} />

        <label>Profile Picture:</label>
        <input type="file" onChange={handleFileChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" className="preview-img" />}

        <div className="actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
