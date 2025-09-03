import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsersForAdmin, deleteUserByAdmin } from "../services/updateprofileservice";
import type { User } from "../services/updateprofileservice";
import "../style/UpdateProfilePage.css";
const UpdateProfilePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsersForAdmin();
      setUsers(res);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/adminDashboard/profile/${id}`);
  };

  const handleDelete = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await deleteUserByAdmin(id);
    alert(res.message); // "User deleted successfully"
    fetchUsers(); // refresh table
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Error deleting user");
  }
};


  return (
    <div className="update-profile-page">
      <h2>Update User Profiles</h2>
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
                <button onClick={() => handleEdit(user.id)}>Edit Profile</button>
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
