import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../services/reservationservice";
import QRReader from "../components/QRReader";
import "../style/Reservation.css";

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: 1,
    slot_id: 1,
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

  const [showQRModal, setShowQRModal] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [scanMethod, setScanMethod] = useState<"camera" | "upload" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQRResult = (data: string) => {
    try {
      const qrData = JSON.parse(data);
      setFormData((prev) => ({ ...prev, ...qrData }));
    } catch {
      setFormData((prev) => ({ ...prev, sample_id: data }));
    }
    setQrScanned(true);
    setShowQRModal(false); // close modal after success
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReservation({
        ...formData,
        userId: String(formData.user_id),   // ✅ match backend
        slotId: String(formData.slot_id),
        date: formData.reservation_date,
        time: formData.reservation_time,
      });
      navigate("/reservation-success");
    } catch {
      alert("❌ Failed to submit reservation");
    }
  };

  return (
    <div className="reservation-page">
      <h2>📌 Sample Reservation</h2>

      <form onSubmit={handleSubmit} className="reservation-form">
        <label>Sample ID:</label>
        <input
          type="text"
          name="sample_id"
          value={formData.sample_id}
          onChange={handleChange}
        />

        {/* ✅ Scan QR button */}
        {!qrScanned && (
          <button
            type="button"
            className="scan-btn"
            onClick={() => {
              setShowQRModal(true);
              setScanMethod(null); // reset choice
            }}
          >
            📷 Scan QR
          </button>
        )}

        <label>Sample Type:</label>
        <select
          name="sample_type"
          value={formData.sample_type}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="water">Water</option>
          <option value="soil">Soil</option>
          <option value="plant">Plant</option>
          <option value="biological fluids">Biological Fluids</option>
        </select>

        <label>Collection Date:</label>
        <input
          type="date"
          name="collection_date"
          value={formData.collection_date}
          onChange={handleChange}
        />

        <label>Collection Time:</label>
        <input
          type="time"
          name="collection_time"
          value={formData.collection_time}
          onChange={handleChange}
        />

        <label>Geo Location:</label>
        <input
          type="text"
          name="geo_location"
          value={formData.geo_location}
          onChange={handleChange}
        />

        <label>Temperature (°C):</label>
        <input
          type="number"
          name="temperature"
          value={formData.temperature}
          onChange={handleChange}
        />

        <label>pH:</label>
        <input
          type="number"
          name="pH"
          value={formData.pH}
          onChange={handleChange}
        />

        <label>Salinity:</label>
        <input
          type="number"
          name="salinity"
          value={formData.salinity}
          onChange={handleChange}
        />

        {/* ✅ Submit only visible if manual filled OR QR scanned */}
        {(formData.sample_id || qrScanned) && (
          <button type="submit" className="submit-btn">
            ✅ Submit Reservation
          </button>
        )}
      </form>

      {/* ✅ QR Modal */}
      {showQRModal && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <button className="close-btn" onClick={() => setShowQRModal(false)}>
              ❌
            </button>
            <h3>Scan QR Code</h3>

            {!scanMethod ? (
              <>
                <p>Choose an option:</p>
                <button onClick={() => setScanMethod("camera")}>📷 Use Camera</button>
                <button onClick={() => setScanMethod("upload")}>📂 Upload File</button>
              </>
            ) : scanMethod === "camera" ? (
              <QRReader onResult={handleQRResult} />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    // TODO: integrate QR decode from uploaded file
                    alert("Upload feature not fully implemented");
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
