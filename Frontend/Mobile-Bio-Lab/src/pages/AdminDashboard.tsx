import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../service/adminservice";
import { getPendingUsers, approveUser, rejectUser, deleteUser } from "../service/adminservice";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  // Redirect non-admins
  useEffect(() => {
    const loggedInUserStr = localStorage.getItem("loggedInUser");
    if (!loggedInUserStr) return navigate("/login");

    const loggedInUser = JSON.parse(loggedInUserStr) as { role: string };
    if (loggedInUser.role !== "admin") navigate("/dashboard");
  }, [navigate]);

  // Fetch pending users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const pendingUsers = await getPendingUsers();
        console.log("Fetched users:", pendingUsers);
        setUsers(pendingUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Approve user
  const handleApprove = async (id: number) => {
    try {
      await approveUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "approved" } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Reject user
  const handleReject = async (id: number) => {
    try {
      await rejectUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "rejected" } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete user
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      {users.length === 0 ? (
        <p>No pending users.</p>
      ) : (
        <ul className="user-list">
          {users.map((u) => (
            <li key={u.id} className="user-card">
              <div>
                <strong>{u.firstName} {u.lastName}</strong> - {u.email}
              </div>
              <div>Status: {u.status ?? "pending"}</div>
              <div className="actions">
                {u.status !== "approved" && u.status !== "rejected" && (
                  <>
                    <button className="approve-btn" onClick={() => handleApprove(u.id)}>Approve</button>
                    <button className="reject-btn" onClick={() => handleReject(u.id)}>Reject</button>
                  </>
                )}
                <button className="delete-btn" onClick={() => handleDelete(u.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
