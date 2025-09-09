import { useState } from "react";
import { downloadUserReport } from "../services/reportService";

export default function AdminReport() {
  const [role, setRole] = useState("");
  const [city, setCity] = useState("");

  const handleDownload = async () => {
    try {
      await downloadUserReport(role, city);
    } catch (err) {
      console.error("Report download failed", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Generate User Report</h2>

      <div className="flex gap-2 mb-4">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2"
        >
          <option value="">All Roles</option>
          <option value="Student">Student</option>
          <option value="Researcher">Researcher</option>
          <option value="Technician">Technician</option>
        </select>

        <input
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2"
        />
      </div>

      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download Report
      </button>
    </div>
  );
}
