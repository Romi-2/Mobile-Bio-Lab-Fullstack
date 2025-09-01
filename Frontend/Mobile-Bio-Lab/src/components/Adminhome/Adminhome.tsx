import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./AdminHome.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminHome: React.FC = () => {
  const data = {
    labels: ["Active Users", "Pending Users", "Admins"],
    datasets: [
      {
        label: "# of Users",
        data: [120, 30, 10],
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

  return (
    <div className="admin-home">
      <h1>Admin Dashboard</h1>

      {/* Cards row */}
      <div className="dashboard-cards-row">
        <div className="card">Total Users: 160</div>
        <div className="card">Pending Users: 30</div>
        <div className="card">Admins: 10</div>
      </div>

      {/* Pie Chart */}
      <div className="charts">
        <div className="chart">
          <h3>User Distribution</h3>
          <Pie data={data} />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
