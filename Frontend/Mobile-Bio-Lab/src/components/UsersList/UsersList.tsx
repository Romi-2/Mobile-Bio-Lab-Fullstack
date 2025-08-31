import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../services/userslistservice";
import type { User } from "../../services/adminservice";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate for button navigation
import "./UsersList.css";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    fetchUsers();
  };

  const handleEdit = (id: number) => {
    navigate(`/adminDashboard/profile/${id}`); // navigate to admin update profile page
  };

  const filtered = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-list">
      <h2>Users List</h2>
      <input
        type="text"
        placeholder="Search by name or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {filtered.map((u) => (
          <li key={u.id}>
            <span>
              {u.firstName} {u.lastName} ({u.city})
            </span>
            <button onClick={() => handleDelete(u.id)}>Delete</button>
            <button onClick={() => handleEdit(u.id)}>Edit</button> {/* ✅ Edit as button */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
