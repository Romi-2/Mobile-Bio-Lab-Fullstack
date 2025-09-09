import { useState } from "react";
import { downloadUserReport } from "../services/reportService";
import "../App.css"; // ✅ add CSS file

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
    <div className="report-container">
      <h2 className="report-title">📑 Generate User Report</h2>

      <div className="report-filters">
        <div className="form-group">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-input"
          >
            <option value="">All Roles</option>
            <option value="Student">Student</option>
            <option value="Researcher">Researcher</option>
            <option value="Technician">Technician</option>
          </select>
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <button onClick={handleDownload} className="btn-download">
        Download PDF
      </button>
    </div>
  );
}
