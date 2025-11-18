import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import "../style/Userhome.css"
interface SampleData {
  id: string;
  sample_type: string;
  collection_date: string;
  temperature: number;
  pH: number;
  salinity: number;
  status: string;
}

const COLORS = ["#facc15", "#22c55e", "#ef4444", "#3b82f6"];

// --- Mock Data ---
const mockBiologicalData = {
  sampleTypes: [
    { name: "Water", value: 45 },
    { name: "Soil", value: 30 },
    { name: "Plant", value: 15 },
    { name: "Biological Fluids", value: 10 },
  ],
  monthlySamples: [
    { month: "Jan", samples: 12, temperature: 25.4, pH: 7.2 },
    { month: "Feb", samples: 18, temperature: 26.1, pH: 7.1 },
    { month: "Mar", samples: 22, temperature: 27.3, pH: 7.3 },
    { month: "Apr", samples: 15, temperature: 26.8, pH: 7.0 },
    { month: "May", samples: 28, temperature: 28.2, pH: 7.4 },
    { month: "Jun", samples: 32, temperature: 29.5, pH: 7.2 },
  ],
};

const UsersHome: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userSamples, setUserSamples] = useState<SampleData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const samples = await new Promise<SampleData[]>((resolve) =>
        setTimeout(
          () =>
            resolve([
              {
                id: "S1",
                sample_type: "Water",
                collection_date: "2024-01-01",
                temperature: 25,
                pH: 7.2,
                salinity: 30,
                status: "completed",
              },
              {
                id: "S2",
                sample_type: "Soil",
                collection_date: "2024-02-10",
                temperature: 22,
                pH: 6.8,
                salinity: 28,
                status: "pending",
              },
            ]),
          300
        )
      );

      setUserSamples(samples);
      setLoading(false);
    };

    fetchData();
  }, []);

  const stats = {
    totalSamples: userSamples.length,
    completed: userSamples.filter((s) => s.status === "completed").length,
    pending: userSamples.filter((s) => s.status === "pending").length,
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <h1>Biological Data Analytics</h1>

      {/* STATS */}
      <div className="stats-overview">
        <div className="stat-card"><h3>Total Samples</h3><p>{stats.totalSamples}</p></div>
        <div className="stat-card"><h3>Completed</h3><p>{stats.completed}</p></div>
        <div className="stat-card"><h3>Pending</h3><p>{stats.pending}</p></div>
      </div>

      {/* 4 CHARTS GRID */}
      <div className="charts-grid">

        {/* 1️⃣ Pie Chart */}
        <div className="chart-container">
          <h3>Sample Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={mockBiologicalData.sampleTypes} dataKey="value" outerRadius={100}>
                {mockBiologicalData.sampleTypes.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 2️⃣ Bar Chart */}
        <div className="chart-container">
          <h3>Monthly Sample Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockBiologicalData.monthlySamples}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="samples" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3️⃣ Line Chart - Temperature Trend */}
        <div className="chart-container">
          <h3>Temperature Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockBiologicalData.monthlySamples}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#F87171" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 4️⃣ Area Chart - pH Trend */}
        <div className="chart-container">
          <h3>pH Level Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockBiologicalData.monthlySamples}>
              <defs>
                <linearGradient id="colorPH" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="pH"
                stroke="#16A34A"
                fillOpacity={1}
                fill="url(#colorPH)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* TABLE */}
      <h3>Recent Samples</h3>
      <table className="samples-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Date</th>
            <th>Temp</th>
            <th>pH</th>
            <th>Salinity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {userSamples.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.sample_type}</td>
              <td>{new Date(s.collection_date).toLocaleDateString()}</td>
              <td>{s.temperature}</td>
              <td>{s.pH}</td>
              <td>{s.salinity}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UsersHome;
