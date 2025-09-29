// frontend/src/pages/SamplePage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useZxing } from "react-zxing"; // ✅ QR Scanner
import "../style/sample.css";

interface SampleResponse {
  msg: string;
  id?: number;
}

interface SampleFormData {
  reservation_id: number;
  sampleType: string;
  collectionDate: string;
  collectionTime: string;
  temperature: string;
  pH: string;
  salinity: string;
  location: string;
  sampleId: string; // ✅ added for QR
}

const SamplePage: React.FC = () => {
  const navigate = useNavigate();
  const { reservationId } = useParams<{ reservationId: string }>();

  const [form, setForm] = useState<SampleFormData>({
    reservation_id: Number(reservationId) || 0,
    sampleType: "",
    collectionDate: "",
    collectionTime: "",
    temperature: "",
    pH: "",
    salinity: "",
    location: "",
    sampleId: "",
  });

  const [scanMode, setScanMode] = useState(false);

  // ✅ Setup QR Scanner
  const { ref } = useZxing({
    onDecodeResult(result) {
      const qrText = result.getText();
      console.log("QR Code Result:", qrText);

      // Example: if QR contains JSON data
      try {
        const parsed = JSON.parse(qrText);
        setForm((prev) => ({ ...prev, ...parsed }));
        alert("QR scanned and form auto-filled!");
      } catch {
        // Otherwise, just set sampleId
        setForm((prev) => ({ ...prev, sampleId: qrText }));
        alert("QR scanned!");
      }

      setScanMode(false); // stop scanner
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.sampleType) {
      alert("Please select a sample type");
      return;
    }
    try {
      const res = await axios.post<SampleResponse>(
        "http://localhost:5000/api/samples",
        form
      );
      alert(res.data.msg);
      navigate(`/waiting-approval/${form.reservation_id}`);
    } catch (err) {
      console.error("Error saving sample:", err);
      alert("Error saving sample");
    }
  };

  return (
    <div className="sample-container">
      <form onSubmit={handleSubmit} className="sample-form">
        <h2>Submit Sample Details</h2>

        <input
          type="text"
          name="sampleId"
          placeholder="Sample ID"
          value={form.sampleId}
          onChange={handleChange}
          required
        />

        <button
          type="button"
          onClick={() => setScanMode((prev) => !prev)}
          className="scan-btn"
        >
          {scanMode ? "Stop Scanning" : "Scan QR Code"}
        </button>

        {scanMode && <video ref={ref} style={{ width: "100%" }} />}

        <select
          name="sampleType"
          value={form.sampleType}
          onChange={handleChange}
          required
        >
          <option value="">Select Sample Type</option>
          <option value="water">Water</option>
          <option value="soil">Soil</option>
          <option value="plant">Plant</option>
          <option value="biological fluids">Biological Fluids</option>
        </select>

        <input
          type="date"
          name="collectionDate"
          value={form.collectionDate}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="collectionTime"
          value={form.collectionTime}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="temperature"
          placeholder="Temperature (°C)"
          value={form.temperature}
          onChange={handleChange}
        />

        <input
          type="text"
          name="pH"
          placeholder="pH Level"
          value={form.pH}
          onChange={handleChange}
        />

        <input
          type="text"
          name="salinity"
          placeholder="Salinity (ppt)"
          value={form.salinity}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Geolocation / Field Location"
          value={form.location}
          onChange={handleChange}
        />

        <button type="submit">Submit Sample</button>
      </form>
    </div>
  );
};

export default SamplePage;
