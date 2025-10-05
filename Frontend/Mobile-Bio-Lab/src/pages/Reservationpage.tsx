// frontend/src/pages/ReservationPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type  { Slot } from "../services/slotservice";
import { createReservation, getAvailableSlots } from "../services/reservationservice";
import QRReader from "../components/QRReader";
import "../style/Reservation.css";

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [allAvailableSlots, setAllAvailableSlots] = useState<Slot[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [scanMethod, setScanMethod] = useState<"camera" | "upload" | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    user_id: 1,
    slot_id: 0,
    reservation_date: "",
    reservation_time: "",
    duration: "1h 30m",
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

useEffect(() => {
  const fetchAvailable = async () => {
    try {
      const data: Slot[] = await getAvailableSlots();
      console.log("Fetched available slots:", data);
      setAllAvailableSlots(data);

      const uniqueDates = [...new Set(data.map(slot => slot.date))];
      setAvailableDates(uniqueDates);
    } catch (err) {
      console.error("Error fetching available slots:", err);
    }
  };

  fetchAvailable();
}, []);

const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const date = e.target.value;
  setSelectedDate(date);
  setSelectedTime("");

  if (date) {
    const timesForDate = allAvailableSlots
      .filter((slot) => slot.date === date)
      .map((slot) => `${slot.start_time} TO ${slot.end_time}`);

    setAvailableTimes(timesForDate);
  } else {
    setAvailableTimes([]);
  }
};

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  // Handle input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle QR result
  const handleQRResult = (data: string) => {
    try {
      const qrData = JSON.parse(data);
      setFormData((prev) => ({
        ...prev,
        sample_id: qrData.sample_id || qrData.id || prev.sample_id,
        sample_type: qrData.sample_type || qrData.type || prev.sample_type,
        collection_date: qrData.collection_date || qrData.date || prev.collection_date,
        collection_time: qrData.collection_time || qrData.time || prev.collection_time,
        geo_location: qrData.geo_location || qrData.location || prev.geo_location,
        temperature: qrData.temperature || qrData.temp || prev.temperature,
        pH: qrData.pH || qrData.ph || prev.pH,
        salinity: qrData.salinity || prev.salinity,
      }));
    } catch {
      setFormData((prev) => ({ ...prev, sample_id: data }));
    }
    setShowQRModal(false);
  };

  // Submit reservation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedDate || !selectedTime || !formData.sample_id || !formData.sample_type) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await createReservation(formData);
      alert("✅ Reservation created successfully!");
      navigate("/reservation-success");
    } catch (error) {
      console.error("Reservation error:", error);
      alert("❌ Failed to submit reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-page">
      <h2>Sample Reservation Form</h2>

      <form onSubmit={handleSubmit} className="reservation-form">
        {/* Sample Info */}
        <div className="form-card">
          <div className="card-header"><h3>📋 Sample Information</h3></div>
          <div className="card-body">
            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">🆔</span>
                <input
                  type="text"
                  name="sample_id"
                  value={formData.sample_id}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter Sample ID"
                  className="form-input"
                />
                <button
                  type="button"
                  className="scan-btn"
                  onClick={() => { setShowQRModal(true); setScanMethod(null); }}
                >
                  📷 Scan QR
                </button>
              </div>
            </div>

            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">🧪</span>
                <select
                  name="sample_type"
                  value={formData.sample_type}
                  onChange={handleFormChange}
                  required
                  className="form-dropdown"
                >
                  <option value="">Select Sample Type</option>
                  <option value="water">Water</option>
                  <option value="soil">Soil</option>
                  <option value="plant">Plant</option>
                  <option value="biological fluids">Biological Fluids</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Schedule */}
        <div className="form-card">
          <div className="card-header"><h3>📅 Reservation Schedule</h3></div>
          <div className="card-body">
            <div className="form-group">
              <select value={selectedDate} onChange={handleDateChange} required>
                <option value="">Select Date</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <select value={selectedTime} onChange={handleTimeChange} required>
                <option value="">Select Time</option>
                {availableTimes.map((time, i) => (
                  <option key={i} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Field Conditions */}
        <div className="form-card">
          <div className="card-header"><h3>🔬 Field Conditions</h3></div>
          <div className="card-body">
            <input type="number" name="temperature" value={formData.temperature} onChange={handleFormChange} placeholder="Temperature (°C)" required />
            <input type="number" name="pH" value={formData.pH} onChange={handleFormChange} placeholder="pH Level" min="0" max="14" required />
            <input type="number" name="salinity" value={formData.salinity} onChange={handleFormChange} placeholder="Salinity" required />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "⏳ Processing..." : "✅ Submit Reservation"}
        </button>
      </form>

      {/* QR Modal */}
      {showQRModal && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <button className="close-btn" onClick={() => setShowQRModal(false)}>❌</button>
            <h3>Scan QR Code</h3>
            {!scanMethod ? (
              <div className="scan-options">
                <button onClick={() => setScanMethod("camera")}>📷 Use Camera</button>
                <button onClick={() => setScanMethod("upload")}>📂 Upload File</button>
              </div>
            ) : scanMethod === "camera" ? (
              <QRReader onResult={handleQRResult} />
            ) : (
              <div>
                <input type="file" accept="image/*" />
                <button onClick={() => setScanMethod(null)}>Back</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
