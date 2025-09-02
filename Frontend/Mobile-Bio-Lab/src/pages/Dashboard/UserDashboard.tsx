import React, { useState, useEffect } from "react";
import { getUserStatus } from "../../services/userstatusservice"; // adjust path
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../../style/UserDashboard.css";

const UserDashboard: React.FC = () => {
  const [accountStatus, setAccountStatus] = useState<"Pending" | "Approved" | "Rejected">("Pending");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getUserStatus();
        setAccountStatus(data.status); // 👈 backend decides
      } catch (error) {
        console.error("Failed to fetch user status:", error);
      }
    };

    fetchStatus();
  }, []);

  const chartData = [
    { name: "Pending", value: accountStatus === "Pending" ? 1 : 0 },
    { name: "Approved", value: accountStatus === "Approved" ? 1 : 0 },
    { name: "Rejected", value: accountStatus === "Rejected" ? 1 : 0 },
  ];

  const COLORS = ["#facc15", "#22c55e", "#ef4444"];

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      alert("Your account has been deleted!");
      // TODO: Call backend API for account deletion
    }
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>User Dashboard</h2>
        <ul>
          <li>
            <div className="sidebar-item">
              <span className={`status ${accountStatus.toLowerCase()}`}>{accountStatus}</span>
            </div>
          </li>

          <li>
            <div className="sidebar-item">
              <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
            </div>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h3>Account Status Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </main>
    </div>
  );
};

export default UserDashboard;
