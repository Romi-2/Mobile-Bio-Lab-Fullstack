import React, { useEffect, useState } from "react";
import { getPendingUsers, approveUser, rejectUser } from "../service/adminservice";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  role: string;
  status?: string;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    setLoggedInUser(user);

    if (!user) {
      window.location.href = "/home";
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getPendingUsers(); // ✅ use fetchedUsers consistently
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approveUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "approved" } : u))
      );
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "rejected" } : u))
      );
    } catch (err) {
      console.error("Error rejecting user:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <ul className="user-list">
        {loggedInUser?.role === "admin" ? (
          users.map((u) => (
            <li key={u.id}>
              <div className="user-info">
                <strong>
                  {u.firstName} {u.lastName}
                </strong>
                <br />
                Email: {u.email}
                <br />
                City: {u.city}
                <br />
                Status: {u.status || "pending ❌"}
              </div>
              <div>
                <span className="user-role">{u.role.toUpperCase()}</span>
                {u.status === "pending" && (
                  <>
                    <button onClick={() => handleApprove(u.id)}>Approve</button>
                    <button onClick={() => handleReject(u.id)}>Reject</button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          // ✅ Normal user: only see own status
          <li>
            <div className="user-info">
              <strong>
                {loggedInUser?.firstName} {loggedInUser?.lastName}
              </strong>
              <br />
              Email: {loggedInUser?.email}
              <br />
              City: {loggedInUser?.city}
              <br />
              Status:{" "}
              {
                users.find((u) => u.id === loggedInUser?.id)?.status ||
                "pending ❌"
              }
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
