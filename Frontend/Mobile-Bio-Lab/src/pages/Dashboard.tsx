import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  role: string;
  profilePicture?: string;
  isActive: boolean;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<User[]>("http://localhost:5000/api/admin/users");
        setUsers(res.data); // ✅ no red underline now
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/approve`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: true } : u))
      );
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  const handleUpdateEmail = async (id: string, newEmail: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/update-email`, {
        email: newEmail,
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, email: newEmail } : u))
      );
    } catch (err) {
      console.error("Error updating email:", err);
    }
  };

  const handleUploadPicture = async (id: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      await axios.post(
        `http://localhost:5000/api/admin/users/${id}/upload-picture`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Refresh users after upload
      const res = await axios.get<User[]>("http://localhost:5000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error uploading picture:", err);
    }
  };

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Role</th>
            <th>Status</th>
            <th>Profile Picture</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>
                {u.firstName} {u.lastName}
              </td>
              <td>{u.email}</td>
              <td>{u.city}</td>
              <td>{u.role}</td>
              <td>{u.isActive ? "Approved" : "Pending"}</td>
              <td>
                {u.profilePicture ? (
                  <img
                    src={u.profilePicture}
                    alt="Profile"
                    width={50}
                    height={50}
                  />
                ) : (
                  "No picture"
                )}
              </td>
              <td>
                {!u.isActive && (
                  <button onClick={() => handleApprove(u._id)}>Approve</button>
                )}
                <button
                  onClick={() =>
                    handleUpdateEmail(
                      u._id,
                      prompt("Enter new email:", u.email) || u.email
                    )
                  }
                >
                  Update Email
                </button>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleUploadPicture(u._id, e.target.files[0]);
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
