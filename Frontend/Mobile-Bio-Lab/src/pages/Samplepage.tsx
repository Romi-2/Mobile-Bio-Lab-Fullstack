// frontend/src/pages/SamplePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "qr-scanner"; // ✅ library for decoding QR from images
import "../style/sample.css";

interface FormData {
  sampleId: string;
  sampleType: string;
  collectionDate: string;
  collectionTime: string;
  geoLocation: string;
  temperature: string;
  pH: string;
  salinity: string;
}

interface Errors {
  [key: string]: string;
}

const SamplePage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    sampleId: "",
    sampleType: "",
    collectionDate: "",
    collectionTime: "",
    geoLocation: "",
    temperature: "",
    pH: "",
    salinity: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  // ✅ Handle QR Upload & Decode
  const handleQRUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    try {
      const result = await QrScanner.scanImage(file);

      try {
        // If QR contains JSON data
        const parsed = JSON.parse(result);

        setForm((prev) => ({
          ...prev,
          ...parsed,
          sampleType: parsed.sampleType || prev.sampleType, // ✅ ensure sampleType is set
        }));

        alert("Sample data populated from QR/Barcode!");
      } catch {
        // If QR contains only plain text (e.g., sample ID)
        setForm((prev) => ({ ...prev, sampleId: result }));
        alert("Sample ID populated from QR/Barcode!");
      }
    } catch (err) {
      console.error("❌ QR Scan failed:", err);
      alert("Could not read QR code from image.");
    }
  };

  // Handle field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Custom Validation
  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!form.sampleId.trim()) newErrors.sampleId = "Sample ID is required";
    if (!form.sampleType) newErrors.sampleType = "Please select a sample type";
    if (!form.collectionDate)
      newErrors.collectionDate = "Collection date is required";
    if (!form.collectionTime)
      newErrors.collectionTime = "Collection time is required";
    if (!form.geoLocation.trim())
      newErrors.geoLocation = "Geolocation is required";
    if (!form.temperature.trim())
      newErrors.temperature = "Temperature is required";
    if (!form.pH.trim()) newErrors.pH = "pH is required";
    if (!form.salinity.trim()) newErrors.salinity = "Salinity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("Form submitted:", form);
    alert("Form submitted successfully!");
    navigate("/success"); // example redirect
  };

  return (
    <div className="sample-container">
      <h2>Biological Sample Entry</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Sample ID */}
        <label>Sample ID:</label>
        <input
          type="text"
          name="sampleId"
          value={form.sampleId}
          onChange={handleChange}
        />
        {errors.sampleId && <span className="error">{errors.sampleId}</span>}

        {/* ✅ Upload QR/Barcode */}
       {/* Upload QR/Barcode */}
<div className="form-group">
  <label htmlFor="qr-upload" className="scan-btn">
    Upload QR/Barcode
  </label>
  <input
    type="file"
    id="qr-upload"
    accept="image/*"
    onChange={handleQRUpload}
    style={{ display: "none" }}
  />
</div>

<div className="form-group">
      <label htmlFor="sampleType">Sample Type:</label>
      <select
        id="sampleType"
        name="sampleType"
        value={form.sampleType}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Sample Type --</option>
        <option value="water">Water</option>
        <option value="soil">Soil</option>
        <option value="plant">Plant</option>
        <option value="biological fluids">Biological Fluids</option>
      </select>
      {errors.sampleType && (
        <span className="error">{errors.sampleType}</span>
      )}
    </div>

        <label>Collection Date:</label>
        <input
          type="date"
          name="collectionDate"
          value={form.collectionDate}
          onChange={handleChange}
        />
        {errors.collectionDate && (
          <span className="error">{errors.collectionDate}</span>
        )}

        {/* Collection Time */}
        <label>Collection Time:</label>
        <input
          type="time"
          name="collectionTime"
          value={form.collectionTime}
          onChange={handleChange}
        />
        {errors.collectionTime && (
          <span className="error">{errors.collectionTime}</span>
        )}

        {/* Geolocation */}
        <label>Geolocation:</label>
        <input
          type="text"
          name="geoLocation"
          placeholder="e.g., 31.5204° N, 74.3587° E"
          value={form.geoLocation}
          onChange={handleChange}
        />
        {errors.geoLocation && (
          <span className="error">{errors.geoLocation}</span>
        )}

        {/* ✅ Field Conditions */}
        <h3>Field Conditions</h3>

        <label>Temperature (°C):</label>
        <input
          type="text"
          name="temperature"
          value={form.temperature}
          onChange={handleChange}
        />
        {errors.temperature && (
          <span className="error">{errors.temperature}</span>
        )}

        <label>pH:</label>
        <input
          type="text"
          name="pH"
          value={form.pH}
          onChange={handleChange}
        />
        {errors.pH && <span className="error">{errors.pH}</span>}

        <label>Salinity (ppt):</label>
        <input
          type="text"
          name="salinity"
          value={form.salinity}
          onChange={handleChange}
        />
        {errors.salinity && (
          <span className="error">{errors.salinity}</span>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SamplePage;
