// frontend/src/pages/ReservationPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../services/reservationservice";
import QrScanner from "qr-scanner"; // ✅ make sure qr-scanner is installed
import "../style/Reservation.css";

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: 1, // TODO: Replace with logged-in user ID
    slot_id: 1, // TODO: Pass from previous page
    reservation_date: "",
    reservation_time: "",
    duration: "1h",
    status: "pending",
    sample_id: "",
    sample_type: "",
    collection_date: "",
    collection_time: "",
    geo_location: "",
    temperature: "",
    pH: "",
    salinity: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // QR Scan handler (auto-fill sample ID + dates if encoded)
  const handleScanQR = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const file = event.target.files[0];
    const result = await QrScanner.scanImage(file);
    try {
      const qrData = JSON.parse(result); // If QR contains JSON
      setFormData((prev) => ({ ...prev, ...qrData }));
    } catch {
      setFormData((prev) => ({ ...prev, sample_id: result }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReservation({
        ...formData,
        userId: String(formData.user_id),
        date: formData.reservation_date,
        time: formData.reservation_time,
      });
      navigate("/reservation-success");
    } catch {
      alert("Failed to submit reservation");
    }
  };

  return (
    <div className="reservation-page">
      <h2>Sample Reservation</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        <label>Sample ID:</label>
        <input type="text" name="sample_id" value={formData.sample_id} onChange={handleChange} />

        <label>Scan QR Code:</label>
        <input type="file" accept="image/*" onChange={handleScanQR} />

        <label>Sample Type:</label>
        <select name="sample_type" value={formData.sample_type} onChange={handleChange}>
          <option value="">Select</option>
          <option value="water">Water</option>
          <option value="soil">Soil</option>
          <option value="plant">Plant</option>
          <option value="biological fluids">Biological Fluids</option>
        </select>

        <label>Collection Date:</label>
        <input type="date" name="collection_date" value={formData.collection_date} onChange={handleChange} />

        <label>Collection Time:</label>
        <input type="time" name="collection_time" value={formData.collection_time} onChange={handleChange} />

        <label>Geo Location:</label>
        <input type="text" name="geo_location" value={formData.geo_location} onChange={handleChange} />

        <label>Temperature (°C):</label>
        <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} />

        <label>pH:</label>
        <input type="number" name="pH" value={formData.pH} onChange={handleChange} />

        <label>Salinity:</label>
        <input type="number" name="salinity" value={formData.salinity} onChange={handleChange} />

        <button type="submit" className="submit-btn">Submit Reservation</button>
      </form>
    </div>
  );
};

export default ReservationPage;
