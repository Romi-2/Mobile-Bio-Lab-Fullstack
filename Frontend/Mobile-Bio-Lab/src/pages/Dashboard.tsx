import { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  city: string;
  isVerified: boolean;
  email?: string;
}

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newCity, setNewCity] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>("http://localhost:5000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ✅ Verify user
  const verifyUser = async (id: number) => {
    await axios.put(`http://localhost:5000/api/admin/users/${id}/verify`);
    fetchUsers();
  };

  // ❌ Delete user
  const deleteUser = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
    fetchUsers();
  };

  // ✏️ Open edit form
  const startEdit = (user: User) => {
    setEditUser(user);
    setNewEmail(user.email || "");
    setNewCity(user.city);
  };

  // ✏️ Save edited user
  const saveEdit = async () => {
    if (!editUser) return;
    await axios.put(`http://localhost:5000/api/admin/users/${editUser.id}`, {
      email: newEmail,
      city: newCity,
      profile_picture: null, // handle later
    });
    setEditUser(null);
    fetchUsers();
  };

  return (
    <div className="p-4">
      <h2>Admin Dashboard</h2>

      {/* Edit Form Modal */}
      {editUser && (
        <div className="edit-modal">
          <h3>Edit User: {editUser.firstName} {editUser.lastName}</h3>
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditUser(null)}>Cancel</button>
        </div>
      )}

      {/* User List */}
      <table border={1} cellPadding={8} style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>City</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.role}</td>
              <td>{u.city}</td>
              <td>{u.isVerified ? "✅ Yes" : "❌ No"}</td>
              <td>
                {!u.isVerified && (
                  <button onClick={() => verifyUser(u.id)}>Verify</button>
                )}
                <button onClick={() => startEdit(u)}>Edit</button>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
