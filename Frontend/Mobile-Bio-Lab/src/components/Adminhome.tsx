import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../style/Adminhome.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminHome: React.FC = () => {
  // Sample data (could be fetched from backend)
  const totalUsers = 160;
  const pendingUsers = 30;
  const admins = 10;

  // Validate data
  const isValidNumber = (value: unknown) => typeof value === "number" && value >= 0;

  const validatedTotalUsers = isValidNumber(totalUsers) ? totalUsers : 0;
  const validatedPendingUsers = isValidNumber(pendingUsers) ? pendingUsers : 0;
  const validatedAdmins = isValidNumber(admins) ? admins : 0;

  const data = {
    labels: ["Active Users", "Pending Users", "Admins"].filter(Boolean), // ensure non-empty
    datasets: [
      {
        label: "# of Users",
        data: [
          validatedTotalUsers - validatedPendingUsers - validatedAdmins,
          validatedPendingUsers,
          validatedAdmins
        ].map((val) => (isValidNumber(val) ? val : 0)),
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Render with error boundary
  const renderChart = () => {
    try {
      if (!data.datasets.length || !data.labels.length) {
        return <p>No valid chart data available</p>;
      }
      return <Pie data={data} />;
    } catch (err) {
      console.error("Chart rendering error:", err);
      return <p>Failed to render chart. Please try again later.</p>;
    }
  };

  return (
    <div className="admin-home">
      <h1>Admin Dashboard</h1>

      {/* Cards row */}
      <div className="dashboard-cards-row">
        <div className="card">Total Users: {validatedTotalUsers}</div>
        <div className="card">Pending Users: {validatedPendingUsers}</div>
        <div className="card">Admins: {validatedAdmins}</div>
      </div>

      {/* Pie Chart */}
      <div className="charts">
        <div className="chart">
          <h3>User Distribution</h3>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
