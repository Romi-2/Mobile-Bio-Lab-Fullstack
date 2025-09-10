import { useState } from "react";
import { downloadUserReport } from "../services/reportService";
import "../style/AdminReport.css";

export default function AdminReport() {
  const allowedRoles = ["Student", "Researcher", "Technician"];

  const [role, setRole] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const validateInputs = (): boolean => {
    const trimmedRole = role.trim();
    const trimmedCity = city.trim();

    if (!trimmedRole && !trimmedCity) {
      setError("Please select a role or enter a city.");
      return false;
    }

    if (trimmedRole && !allowedRoles.includes(trimmedRole)) {
      setError("Invalid role selected.");
      return false;
    }

    if (trimmedCity) {
      const cityRegex = /^[a-zA-Z\s,]+$/;
      if (!cityRegex.test(trimmedCity)) {
        setError("City can only contain letters, commas, and spaces.");
        return false;
      }
      if (trimmedCity.length > 100) {
        setError("City name is too long.");
        return false;
      }
    }

    setError(""); // clear errors if all validations pass
    return true;
  };

  const handleDownload = async () => {
    if (!validateInputs()) return;

    try {
      await downloadUserReport(role.trim(), city.trim());
    } catch (err) {
      console.error("Report download failed", err);
      setError("Failed to download report. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleDownload();
  };

  return (
    <div className="report-container">
      <h2 className="report-title">📑 Generate User Report</h2>

      <div className="report-filters">
        {/* Role Dropdown */}
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-input"
          >
            <option value="">-- Select Role --</option>
            {allowedRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* City Input */}
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="form-input"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Action Button */}
      <div className="actions">
        <button
          onClick={handleDownload}
          className="btn-download"
          disabled={!role.trim() && !city.trim()} // disable if nothing entered
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
