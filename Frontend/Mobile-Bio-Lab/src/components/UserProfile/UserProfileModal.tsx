import React, { useState } from "react";
import { updateUser, type User } from "../../service/adminservice";
import "./UserProfileModal.css";

interface Props {
  user: User | null;
  onClose: () => void;
  onUpdated: () => void;
}

const UserProfileModal: React.FC<Props> = ({ user, onClose, onUpdated }) => {
  const [email, setEmail] = useState(user?.email || "");
  const [city, setCity] = useState(user?.city || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");

  if (!user) return null;

  const handleSave = async () => {
    await updateUser(user.id, { email, city, profilePicture });
    onUpdated();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit User Profile</h3>

        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>City:</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} />

        <label>Profile Picture URL:</label>
        <input
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
        />

        <div className="actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
