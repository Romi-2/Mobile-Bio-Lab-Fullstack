import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../services/userslistservice";
import type { User } from "../services/adminservice";
import { useNavigate } from "react-router-dom";
import "../style/UsersList.css";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null); // ✅ for dropdown message
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
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      const res = await deleteUser(id);
      setMessage(res.message || "User deleted successfully ✅");
      fetchUsers();

      // Auto-hide message after 3s
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage("❌ Failed to delete user");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/adminDashboard/profile/${id}`);
  };

  const filtered = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-list">
      <h2>Users List</h2>

      {/* ✅ Dropdown notification */}
      {message && <div className="list-dropdown-message">{message}</div>}

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
            <div className="actions">
              <button className="delete-btn" onClick={() => handleDelete(u.id)}>
                Delete
              </button>
              <button className="edit-btn" onClick={() => handleEdit(u.id)}>
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
