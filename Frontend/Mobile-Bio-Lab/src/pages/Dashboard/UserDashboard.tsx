import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../../style/UserDashboard.css";

type AccountStatus = "Pending" | "Approved" | "Rejected";

const validStatuses: AccountStatus[] = ["Pending", "Approved", "Rejected"];
const COLORS = ["#facc15", "#22c55e", "#ef4444"];

const UserDashboard: React.FC = () => {
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAccountStatus = async () => {
      try {
        setLoading(true);
        setError("");

        // Simulated API call (replace with real API)
        const response = await new Promise<{ status: string }>((resolve) =>
          setTimeout(() => resolve({ status: "Approved" }), 500)
        );

        const status: string = response.status;

        if (validStatuses.includes(status as AccountStatus)) {
          setAccountStatus(status as AccountStatus);
        } else {
          setAccountStatus("Pending");
        }
      } catch (err) {
        console.error("Failed to fetch account status:", err);
        setError("Unable to fetch account status. Showing default.");
        setAccountStatus("Pending");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountStatus();
  }, []);

  const chartData =
    accountStatus !== null
      ? validStatuses.map((status) => ({
          name: status,
          value: accountStatus === status ? 1 : 0,
        }))
      : [];

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="user-dashboard">
      <aside className="sidebar">
        <h2>User Dashboard</h2>
        <ul>
          <li>
            <div className="sidebar-item">
              <span
                className={`status ${accountStatus?.toLowerCase()}`}
                aria-label={`Account status: ${accountStatus}`}
              >
                {accountStatus}
              </span>
            </div>
          </li>

          {/* ✅ Delete Account NavLink */}
          <li>
            <NavLink
              to="/dashboard/delete-account"
              className={({ isActive }) =>
                `menu-link delete-link ${isActive ? "active" : ""}`
              }
            >
              Delete Account
            </NavLink>
          </li>

          {/* ✅ Share Sample NavLink */}
          <li>
            <NavLink
              to="/dashboard/share/1"
              className={({ isActive }) =>
                `menu-link share-link ${isActive ? "active" : ""}`
              }
            >
              Share Sample
            </NavLink>
          </li>
        </ul>

        {error && <p className="error-message">{error}</p>}
      </aside>

      <main className="main-content">
        <h3>Account Status Overview</h3>
        {chartData.length > 0 ? (
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
        ) : (
          <p>No valid account data available</p>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
