// frontend/src/pages/ReservationPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createReservation } from "../services/reservationservice";
import { getAvailableSlots } from "../services/slotservice"; // ✅ use slotservice version
import type { Slot } from "../services/slotservice";
import QRReader from "../components/QRReader";
import "../style/Reservation.css";

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get selectedCity and slots passed from previous page
  const { selectedCity, citySlots } = location.state || {};

  // States
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [allAvailableSlots, setAllAvailableSlots] = useState<Slot[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [scanMethod, setScanMethod] = useState<"camera" | "upload" | null>(null);

  // Form Data
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

  // Fetch available slots (based on selected city)
  useEffect(() => {
  const fetchAvailable = async () => {
    try {
      setLoading(true);
      let data: Slot[] = [];

      if (citySlots && citySlots.length > 0) {
        console.log("✅ Using slots from navigation:", citySlots);
        data = citySlots;
      } else {
        console.log("🌐 Fetching slots from API...");
        data = await getAvailableSlots();
      }

      // ✅ Filter by selected city (case-insensitive)
      if (selectedCity) {
        data = data.filter(
          (slot) => slot.city.toLowerCase() === selectedCity.toLowerCase()
        );
        console.log(`Filtered slots for city: ${selectedCity}`, data);
      }

      setAllAvailableSlots(data);

      // ✅ Extract unique available dates
      if (data.length > 0) {
        const uniqueDates = [...new Set(data.map((slot) => slot.date))];
        console.log("🗓️ availableDates:", uniqueDates);
        setAvailableDates(uniqueDates);
      } else {
        console.warn("⚠️ No available slots found");
        setAvailableDates([]);
      }
    } catch (err) {
      console.error("Error fetching available slots:", err);
      setAvailableDates([]);
    } finally {
      setLoading(false);
    }
  };

  fetchAvailable();
}, [selectedCity, citySlots]);

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime("");

    setFormData((prev) => ({ ...prev, reservation_date: date }));

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
    const time = e.target.value;
    setSelectedTime(time);
    setFormData((prev) => ({ ...prev, reservation_time: time }));

    if (selectedDate && time) {
      const selectedSlot = allAvailableSlots.find(
        (slot) => slot.date === selectedDate && `${slot.start_time} TO ${slot.end_time}` === time
      );

      if (selectedSlot) {
        setFormData((prev) => ({ ...prev, slot_id: selectedSlot.id }));
      }
    }
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle QR Result
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

  // Add this state near the top
const [message, setMessage] = useState<string | null>(null);

// Update handleSubmit()
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  if (!selectedDate || !selectedTime || !formData.sample_id || !formData.sample_type) {
    setMessage("⚠️ Please fill in all required fields.");
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
    return;
  }

  if (formData.slot_id === 0) {
    setMessage("⚠️ Please select a valid time slot.");
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
    return;
  }

  try {
    const res = await createReservation(formData);
    console.log("✅ Reservation response:", res);

    if (res?.message || res?.success) {
      setMessage("✅ Reservation created successfully!");
      setTimeout(() => navigate("/reservation-success"), 1500);
    } else {
      setMessage("❌ Failed to create reservation. Please try again.");
    }
  } catch (error) {
    console.error("Reservation error:", error);
    setMessage("❌ Failed to submit reservation");
  } finally {
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  }
};

  return (
    <div className="reservation-page">
      {/* ✅ Show selected city in heading */}
      
      <h2>Sample Reservation Form {selectedCity && `- ${selectedCity}`}</h2>

      <form onSubmit={handleSubmit} className="reservation-form">
        {/* Sample Info */}
        <div className="form-card">
          <div className="card-header">
            <h3>📋 Sample Information</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
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
                  onClick={() => {
                    setShowQRModal(true);
                    setScanMethod(null);
                  }}
                >
                  📷 Scan QR
                </button>
          
            </div>

            <div className="form-group">
  <div className="input-with-icon">
    <select
      name="sample_type"
      className="form-dropdown"
      value={formData.sample_type}
      onChange={handleFormChange}
      required
    >
      <option value="">Select Sample Type</option>
      <option value="Water">Water</option>
      <option value="Soil">Soil</option>
      <option value="Plant">Plant</option>
      <option value="Biological Fluids">Biological Fluids</option>
    </select>
  </div>
</div>

          </div>
        </div>

        {/* Reservation Schedule */}
        <div className="form-card">
          <div className="card-header">
            <h3>📅 Reservation Schedule</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
                <select className="form-dropdown" value={selectedDate} onChange={handleDateChange} required>
                  <option value="">Select Date</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              
            </div>

            <div className="form-group">
                <select
                  className="form-dropdown"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  required
                  disabled={!selectedDate}
                >
                  <option value="">{selectedDate ? "Select Time" : "Select Date First"}</option>
                  {availableTimes.map((time, i) => (
                    <option key={i} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
            </div>
          </div>
        </div>

        {/* Collection Details */}
        <div className="form-card">
          <div className="card-header">
            <h3>📝 Collection Details</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
                <input
                  type="text"
                  name="geo_location"
                  value={formData.geo_location}
                  onChange={handleFormChange}
                  placeholder="Geographic Location"
                  className="form-input"
                />
            </div>
          </div>
        </div>

        {/* Field Conditions */}
        <div className="form-card">
          <div className="card-header">
            <h3>🔬 Field Conditions</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleFormChange}
                  placeholder="Temperature (°C)"
                  className="form-input"
                />
            
            </div>
            <div className="form-group">
                <input
                  type="number"
                  name="pH"
                  value={formData.pH}
                  onChange={handleFormChange}
                  placeholder="pH Level"
                  min="0"
                  max="14"
                  step="0.1"
                  className="form-input"
                />
            </div>
            <div className="form-group">
                <input
                  type="number"
                  name="salinity"
                  value={formData.salinity}
                  onChange={handleFormChange}
                  placeholder="Salinity"
                  step="0.1"
                  className="form-input"
                />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "⏳ Processing..." : "✅ Submit Reservation"}
        </button>
      </form>
      {/* ✅ Dropdown message (success/error notice) */}
      {message && (
        <div
          className={`dropdown-message ${
            message.startsWith("✅") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <button className="close-btn" onClick={() => setShowQRModal(false)}>
              ❌
            </button>
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
