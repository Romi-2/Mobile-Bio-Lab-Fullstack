import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../services/adminservice";
import { Pie, Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import type { ChartEvent, ActiveElement } from "chart.js";
import "../style/Adminhome.css";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminHome: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    admins: 0,
  });

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>("monthly");
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  // Navigation handlers using your existing routes
  const navigateToPendingUsers = () => {
    navigate("pending");
  };

  const navigateToUsersList = () => {
    navigate("users");
  };

  const navigateToReports = () => {
    navigate("reports");
  };

  const navigateToReservations = () => {
    navigate("admin/reservations");
  };

  const navigateToProtocols = () => {
    navigate("protocols");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const activeUsers = stats.totalUsers - stats.pendingUsers - stats.admins;

  // Pie Chart Data
  const pieData = {
    labels: ["Active Users", "Pending Users", "Admins"],
    datasets: [
      {
        label: "User Distribution",
        data: [activeUsers, stats.pendingUsers, stats.admins],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(59, 130, 246, 0.8)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Bar Chart Data (Sample growth data)
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Users",
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'User Growth Trend',
      },
    },
    onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        navigateToReports(); // Navigate to reports when chart is clicked
      }
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const clickedElement = elements[0];
        const label = pieData.labels[clickedElement.index];
        
        // Navigate based on which part of the pie chart is clicked
        if (label === "Pending Users") {
          navigateToPendingUsers();
        } else if (label === "Admins") {
          navigateToUsersList();
        } else {
          navigateToUsersList();
        }
      }
    },
  };

  return (
    <div className="admin-home">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-selector"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Stats Cards - Now Clickable */}
      <div className="dashboard-cards-row">
        <div className="card card-primary" onClick={navigateToUsersList}>
          <div className="card-icon">
            <i className="icon-users">👥</i>
          </div>
          <div className="card-content">
            <h3>Total Users</h3>
            <div className="card-value">{stats.totalUsers}</div>
            <div className="card-trend positive">+12% from last month</div>
            <div className="card-click-hint">Click to view all users</div>
          </div>
        </div>

        <div className="card card-warning" onClick={navigateToPendingUsers}>
          <div className="card-icon">
            <i className="icon-pending">⏳</i>
          </div>
          <div className="card-content">
            <h3>Pending Users</h3>
            <div className="card-value">{stats.pendingUsers}</div>
            <div className="card-trend">{stats.pendingUsers > 0 ? "Needs attention" : "All clear"}</div>
            <div className="card-click-hint">Click to manage pending users</div>
          </div>
        </div>

        <div className="card card-info" onClick={navigateToUsersList}>
          <div className="card-icon">
            <i className="icon-admin">👑</i>
          </div>
          <div className="card-content">
            <h3>Admins</h3>
            <div className="card-value">{stats.admins}</div>
            <div className="card-trend">Managing system</div>
            <div className="card-click-hint">Click to view user list</div>
          </div>
        </div>

        <div className="card card-success" onClick={navigateToUsersList}>
          <div className="card-icon">
            <i className="icon-active">✅</i>
          </div>
          <div className="card-content">
            <h3>Active Users</h3>
            <div className="card-value">{activeUsers}</div>
            <div className="card-trend positive">+8% from last month</div>
            <div className="card-click-hint">Click to view active users</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <h3>User Distribution</h3>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color active"></span>
                <span>Active ({activeUsers})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color pending"></span>
                <span>Pending ({stats.pendingUsers})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color admin"></span>
                <span>Admin ({stats.admins})</span>
              </div>
            </div>
          </div>
          <div className="chart-wrapper clickable-chart">
            <Pie data={pieData} options={pieOptions} />
            <div className="chart-overlay-text">Click on segments to navigate</div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>User Growth</h3>
            <span className="chart-subtitle">Last 6 months</span>
          </div>
          <div className="chart-wrapper clickable-chart" onClick={navigateToReports}>
            <Bar data={barData} options={barOptions} />
            <div className="chart-overlay-text">Click to view detailed reports</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation - Using your existing routes */}
      <div className="quick-actions">
        <h3>Quick Navigation</h3>
        <div className="actions-grid">
          <button className="action-btn" onClick={navigateToUsersList}>
            <span className="action-icon">👥</span>
            <span>All Users</span>
            <span className="action-badge">{stats.totalUsers}</span>
          </button>
          <button className="action-btn" onClick={navigateToReports}>
            <span className="action-icon">📊</span>
            <span>Reports</span>
          </button>
          <button className="action-btn" onClick={navigateToReservations}>
            <span className="action-icon">📅</span>
            <span>Reservations</span>
          </button>
          <button className="action-btn" onClick={navigateToProtocols}>
            <span className="action-icon">📋</span>
            <span>Protocols</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;