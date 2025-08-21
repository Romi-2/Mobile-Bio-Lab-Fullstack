import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  city?: string;
  profilePicture?: string;
  isActive: boolean;
  role: "user" | "admin";
}

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>("http://localhost:5000/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Approve/Deactivate user
  const toggleApprove = async (id: string, isActive: boolean) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/approve`, {
        isActive: !isActive,
      });
      fetchUsers(); // refresh
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // Update user info
  const updateUser = async (id: string, field: keyof User, value: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}`, {
        [field]: value,
      });
      fetchUsers(); // refresh
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${id}/profilePicture`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      fetchUsers(); // refresh
    } catch (error) {
      console.error("Error uploading profile picture", error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <table border={1} cellPadding={8} style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              {/* Profile Picture */}
              <td>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    width="40"
                    height="40"
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  "No Image"
                )}
                <br />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      uploadProfilePicture(user._id, e.target.files[0]);
                    }
                  }}
                />
              </td>

              {/* Editable Name */}
              <td>
                <input
                  type="text"
                  defaultValue={user.name}
                  onBlur={(e) => updateUser(user._id, "name", e.target.value)}
                />
              </td>

              {/* Editable Email */}
              <td>
                <input
                  type="email"
                  defaultValue={user.email}
                  onBlur={(e) => updateUser(user._id, "email", e.target.value)}
                />
              </td>

              {/* Editable City */}
              <td>
                <input
                  type="text"
                  defaultValue={user.city || ""}
                  onBlur={(e) => updateUser(user._id, "city", e.target.value)}
                />
              </td>

              {/* Status Toggle */}
              <td>
                <button onClick={() => toggleApprove(user._id, user.isActive)}>
                  {user.isActive ? "Deactivate ❌" : "Approve ✅"}
                </button>
              </td>

              {/* Role Dropdown */}
              <td>
                <select
                  defaultValue={user.role}
                  onChange={(e) => updateUser(user._id, "role", e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              <td>
                <strong>Updated</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
