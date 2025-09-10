// UpdateProfilePage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsersForAdmin, deleteUserByAdmin } from "../services/updateprofileservice";
import type { User } from "../services/updateprofileservice";
import "../style/UpdateProfilePage.css";

const UpdateProfilePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Fetch users with validation
  const fetchUsers = useCallback(async () => {
    try {
      const res = await getAllUsersForAdmin();

      const validUsers = res.filter(
        (user) =>
          user.firstName &&
          user.lastName &&
          user.email &&
          user.city &&
          validateEmail(user.email)
      );

      setUsers(validUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Edit user
  const handleEdit = (user: User) => {
    if (!user.firstName || !user.lastName || !validateEmail(user.email)) {
      setMessage("Cannot edit user with invalid data");
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    navigate(`/adminDashboard/profile/${user.id}`);
  };

  // Delete user
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await deleteUserByAdmin(id);
      setMessage(res.message || "User deleted successfully");
      setMessageType("success");
      fetchUsers(); // Refresh table
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage("Error deleting user");
      setMessageType("error");
    }

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="update-profile-page">
      <h2>Update User Profiles</h2>

      {message && <div className={`dropdown-message ${messageType}`}>{message}</div>}

      <table>
        <thead>
          <tr>
            <th>Profile Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {user.profilePicture ? (
                  <img
                    src={`http://localhost:5000${user.profilePicture}`}
                    alt={`${user.firstName} ${user.lastName}`}
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.city}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit Profile</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateProfilePage;
