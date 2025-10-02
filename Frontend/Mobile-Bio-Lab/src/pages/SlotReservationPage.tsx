import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableSlots } from "../services/slotservice";
import "../style/SlotReservationPage.css"; // We'll create this CSS

interface Slot {
  id: number;
  city: string;
  date: string;
  start_time: string;
  end_time: string;
  available_seats: number;
}

const SlotReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  // Fetch slots from backend
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const data = await getAvailableSlots();
        setSlots(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load slots");
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  // Handle reservation click
  const handleReserve = (slotId: number) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    if (slot.available_seats <= 0) {
      alert("All seats are reserved for this slot.");
      return;
    }

    // Navigate to ReservationPage with selected slot data
    navigate("/reservation", { state: { ...slot } });
  };

  return (
    <div className="slot-reservation-page">
      <h2>Reserve Your Slot</h2>
      {loading && <p>Loading slots...</p>}
      <div className="slots-container">
        {slots.length === 0 && !loading && <p>No slots available!</p>}
        {slots.map(slot => (
          <div
            key={slot.id}
            className={`slot-card ${selectedSlot === slot.id ? "selected" : ""} ${slot.available_seats <= 0 ? "full" : ""}`}
            onClick={() => setSelectedSlot(slot.id)}
          >
            <h3>{slot.city}</h3>
            <p>
              <strong>Date:</strong> {slot.date} <br />
              <strong>Time:</strong> {slot.start_time} - {slot.end_time} <br />
              <strong>Seats:</strong>{" "}
              {slot.available_seats > 0 ? slot.available_seats : "Full"}
            </p>
            <button
              className="reserve-button"
              onClick={() => handleReserve(slot.id)}
              disabled={slot.available_seats <= 0 || loading}
            >
              {slot.available_seats > 0 ? "Reserve" : "Full"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotReservationPage;
