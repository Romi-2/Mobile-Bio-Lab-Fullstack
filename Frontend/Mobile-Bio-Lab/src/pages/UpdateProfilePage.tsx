import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsersForAdmin, deleteUserByAdmin } from "../services/updateprofileservice";
import type { User } from "../services/adminservice";
import "./UpdateProfilePage.css";

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
    await deleteUserByAdmin(id);
    fetchUsers();
  };

  return (
    <div className="update-profile-page">
      <h2>Update User Profiles</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
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
