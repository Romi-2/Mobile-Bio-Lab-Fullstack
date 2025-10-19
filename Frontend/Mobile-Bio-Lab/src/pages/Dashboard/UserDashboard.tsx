// frontend/src/pages/Dashboard/UserDashboard.tsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom"; // Added Outlet
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import "../../style/UserDashboard.css";

type AccountStatus = "Pending" | "Approved" | "Rejected";

const validStatuses: AccountStatus[] = ["Pending", "Approved", "Rejected"];
const COLORS = ["#facc15", "#22c55e", "#ef4444"];

// Interface for sample data
interface SampleData {
  id: string;
  sample_type: string;
  collection_date: string;
  temperature: number;
  pH: number;
  salinity: number;
  status: string;
}

// Mock biological data for visualization
const mockBiologicalData = {
  sampleTypes: [
    { name: "Water", value: 45 },
    { name: "Soil", value: 30 },
    { name: "Plant", value: 15 },
    { name: "Biological Fluids", value: 10 }
  ],
  monthlySamples: [
    { month: "Jan", samples: 12, temperature: 25.4, pH: 7.2 },
    { month: "Feb", samples: 18, temperature: 26.1, pH: 7.1 },
    { month: "Mar", samples: 22, temperature: 27.3, pH: 7.3 },
    { month: "Apr", samples: 15, temperature: 26.8, pH: 7.0 },
    { month: "May", samples: 28, temperature: 28.2, pH: 7.4 },
    { month: "Jun", samples: 32, temperature: 29.5, pH: 7.2 }
  ],
  parameterTrends: [
    { parameter: "Temperature", min: 22.1, avg: 26.5, max: 30.2 },
    { parameter: "pH Level", min: 6.8, avg: 7.2, max: 7.6 },
    { parameter: "Salinity", min: 28.4, avg: 32.1, max: 35.8 },
    { parameter: "Turbidity", min: 1.2, avg: 3.8, max: 8.5 }
  ]
};

const UserDashboard: React.FC = () => {
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [userSamples, setUserSamples] = useState<SampleData[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Simulated API calls
        const accountResponse = await new Promise<{ status: string }>((resolve) =>
          setTimeout(() => resolve({ status: "Approved" }), 500)
        );

        const status: string = accountResponse.status;
        if (validStatuses.includes(status as AccountStatus)) {
          setAccountStatus(status as AccountStatus);
        } else {
          setAccountStatus("Pending");
        }

        // Simulated samples data fetch
        const samplesResponse = await new Promise<SampleData[]>((resolve) =>
          setTimeout(() => resolve([
            { id: "SAMP001", sample_type: "Water", collection_date: "2024-01-15", temperature: 25.4, pH: 7.2, salinity: 32.1, status: "completed" },
            { id: "SAMP002", sample_type: "Soil", collection_date: "2024-01-20", temperature: 23.1, pH: 6.8, salinity: 28.4, status: "completed" },
            { id: "SAMP003", sample_type: "Water", collection_date: "2024-02-05", temperature: 26.7, pH: 7.3, salinity: 33.2, status: "pending" }
          ]), 300)
        );

        setUserSamples(samplesResponse);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Unable to fetch dashboard data.");
        setAccountStatus("Pending");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate user-specific statistics
  const userStats = {
    totalSamples: userSamples.length,
    completedSamples: userSamples.filter(s => s.status === 'completed').length,
    pendingSamples: userSamples.filter(s => s.status === 'pending').length,
    sampleTypes: userSamples.reduce((acc: {[key: string]: number}, sample) => {
      acc[sample.sample_type] = (acc[sample.sample_type] || 0) + 1;
      return acc;
    }, {})
  };

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

  return (
    <div className="user-dashboard">
      <aside className="sidebar">
        <h2>User Dashboard</h2>
        <ul>
          <li>
          <div> {/* Changed to status-container */}
            <span className={`status-full ${accountStatus?.toLowerCase()}`}> {/* Changed to status-full */}
              {accountStatus}
            </span>
          </div>
        </li>

          {/* FIXED: Use relative paths */}
          <li>
            <NavLink
              to="delete-account"  // Changed from /dashboard/delete-account
              className={({ isActive }) =>
                `menu-link delete-link ${isActive ? "active" : ""}`
              }
            >
              Delete Account
            </NavLink>
          </li>

          <li>
            <NavLink
              to="sample/1"  // Changed from /dashboard/sample/1
              className={({ isActive }) =>
                `menu-link share-link ${isActive ? "active" : ""}`
              }
            >
              Share Sample
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="protocols"  // Changed from /protocols (absolute) to relative
              className={({ isActive }) =>
                `menu-link ${isActive ? "active" : ""}`
              }
            >
              Protocols & Guidelines
            </NavLink>
          </li>
        </ul>

        {error && <p className="error-message">{error}</p>}
      </aside>

      <main className="main-content">
        {/* If you want to show the dashboard content by default, keep this */}
        {window.location.pathname === '/userdashboard' || window.location.pathname === '/userdashboard/' ? (
          <>
            <div className="dashboard-header">
              <h1>Biological Data Analytics</h1>
              <div className="stats-overview">
                <div className="stat-card">
                  <h3>Total Samples</h3>
                  <p className="stat-number">{userStats.totalSamples}</p>
                </div>
                <div className="stat-card">
                  <h3>Completed</h3>
                  <p className="stat-number">{userStats.completedSamples}</p>
                </div>
                <div className="stat-card">
                  <h3>Pending</h3>
                  <p className="stat-number">{userStats.pendingSamples}</p>
                </div>
              </div>
            </div>

            <div className="charts-grid">
              {/* Sample Types Distribution */}
              <div className="chart-container">
                <h3>Sample Types Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockBiologicalData.sampleTypes}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }: { name: string; percent?: number }) => 
                        `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                      }
                    >
                      {mockBiologicalData.sampleTypes.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} samples`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Samples Trend */}
              <div className="chart-container">
                <h3>Monthly Samples Collection</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockBiologicalData.monthlySamples}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="samples" fill="#2c5530" name="Number of Samples" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Parameter Trends */}
              <div className="chart-container">
                <h3>Environmental Parameters Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockBiologicalData.monthlySamples}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ff7300" 
                      name="Temperature (°C)" 
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="pH" 
                      stroke="#387908" 
                      name="pH Level" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Parameter Ranges */}
              <div className="chart-container">
                <h3>Parameter Value Ranges</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockBiologicalData.parameterTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="parameter" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="min" fill="#8884d8" name="Minimum" />
                    <Bar dataKey="avg" fill="#82ca9d" name="Average" />
                    <Bar dataKey="max" fill="#ffc658" name="Maximum" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Samples Table */}
            <div className="recent-samples">
              <h3>Your Recent Samples</h3>
              {userSamples.length > 0 ? (
                <table className="samples-table">
                  <thead>
                    <tr>
                      <th>Sample ID</th>
                      <th>Type</th>
                      <th>Collection Date</th>
                      <th>Temperature (°C)</th>
                      <th>pH</th>
                      <th>Salinity (PSU)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userSamples.map((sample) => (
                      <tr key={sample.id}>
                        <td>{sample.id}</td>
                        <td>{sample.sample_type}</td>
                        <td>{new Date(sample.collection_date).toLocaleDateString()}</td>
                        <td>{sample.temperature}</td>
                        <td>{sample.pH}</td>
                        <td>{sample.salinity}</td>
                        <td>
                          <span className={`status-badge ${sample.status}`}>
                            {sample.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No samples found.</p>
              )}
            </div>
          </>
        ) : (
          // This renders nested routes like /userdashboard/protocols, /userdashboard/sample/1, etc.
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default UserDashboard;