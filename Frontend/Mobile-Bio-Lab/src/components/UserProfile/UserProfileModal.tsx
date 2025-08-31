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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || user.email || "");
      setCity(user.city || "");
      setPreviewUrl(user.profilePicture || "");
      setProfileFile(null); // reset file on user change
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

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSave = async () => {
    if (!email || !city) {
      alert("Email and City are required!");
      return;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email address!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("vuEmail", email);
      formData.append("city", city);
      if (profileFile) formData.append("profilePicture", profileFile);

      await updateUserProfile(user.id, formData);

      onUpdated(); // notify parent
      onClose();   // close modal
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit User Profile</h3>

        <label>VU Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter VU email"
        />

        <label>City:</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City"
        />

        <label>Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="preview-img"
          />
        )}

        <div className="actions">
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
