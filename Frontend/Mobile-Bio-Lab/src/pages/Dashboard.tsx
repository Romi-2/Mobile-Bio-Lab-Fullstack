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
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!loggedInUser || loggedInUser.role !== "admin") {
      window.location.href = "/home";
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<User[]>("http://localhost:5000/api/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/approve`);
      setUsers(prev => prev.map(u => (u._id === id ? { ...u, isActive: true } : u)));
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <ul className="user-list">
        {users.map(u => (
          <li key={u._id}>
            <div className="user-info">
              <strong>{u.firstName} {u.lastName}</strong><br />
              Email: {u.email}<br />
              City: {u.city}<br />
              Status: {u.isActive ? "Approved ✅" : "Pending ❌"}
            </div>
            <div>
              <span className="user-role">{u.role.toUpperCase()}</span>
              {!u.isActive && (
                <button onClick={() => handleApprove(u._id)}>Approve</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
