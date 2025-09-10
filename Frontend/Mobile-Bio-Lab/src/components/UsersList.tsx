import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../services/userslistservice";
import type { User } from "../services/adminservice";
import { useNavigate } from "react-router-dom";
import "../style/UsersList.css";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);
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
      setMessage("❌ Failed to fetch users.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteUser(id);
      setMessage(res.message || "User deleted successfully ✅");
      fetchUsers();
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

  // ✅ Trimmed search for safety
  const trimmedSearch = search.trim().toLowerCase();

  const filtered = users.filter((u) => {
    const firstName = u.firstName?.toLowerCase() || "";
    const city = u.city?.toLowerCase() || "";

    if (!trimmedSearch) return true; // if search empty, include all
    return firstName.includes(trimmedSearch) || city.includes(trimmedSearch);
  });

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

      {filtered.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {filtered.map((u) => (
            <li key={u.id}>
              <span>
                {u.firstName || "N/A"} {u.lastName || ""} ({u.city || "N/A"})
              </span>
              <div className="actions">
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </button>
                <button className="edit-btn" onClick={() => handleEdit(u.id)}>
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersList;
