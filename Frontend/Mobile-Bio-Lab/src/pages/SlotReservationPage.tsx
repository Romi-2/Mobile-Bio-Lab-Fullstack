import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import "../style/SlotReservationPage.css";

interface Slot {
  id: number;
  city: string;
  date: string;
  start_time: string;
  end_time: string;
  isBooked: number;
}

interface ReservationResponse {
  id: number;
  msg: string;
}

const SlotReservationPage: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch available slots
  useEffect(() => {
    const fetchSlots = async (): Promise<void> => {
      try {
        const res = await axios.get<Slot[]>("http://localhost:5000/api/slots");
        setSlots(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Fetch slots error:", error.message);
        setError("Failed to load available slots.");
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  // Handle slot reservation
  const handleReserve = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (selectedSlot === null) return;

    try {
      const res = await axios.post<ReservationResponse>(
        "http://localhost:5000/api/reservations",
        { user_id: 1, slot_id: selectedSlot }
      );
      alert("✅ Slot reserved successfully!");
      navigate("/reservation-form", { state: { reservationId: res.data.id } });
    } catch (err) {
      const error = err as AxiosError<{ msg: string }>;
      alert(error.response?.data?.msg || "Failed to reserve slot");
      console.error(error.response?.data || error.message);
    }
  };

  // Handle login
  const handleSlotLogin = (): void => {
  alert("Login clicked from Slot Reservation Page!");
};

  if (loading) return <p>Loading slots...</p>;
  if (error) return <p>{error}</p>;

  const availableSlots = slots.filter((s) => s.isBooked === 0);

  return (
    <div className="slot-reservation">
      <h2>Book a Slot</h2>

      {availableSlots.length === 0 ? (
        <p>No available slots at the moment. Please check later.</p>
      ) : (
        <form className="slot-form" onSubmit={handleReserve}>
          <label>Select a slot:</label>
          <select
            value={selectedSlot ?? ""}
            onChange={(e) => setSelectedSlot(Number(e.target.value) || null)}
          >
            <option value="">-- Choose a Slot --</option>
            {availableSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.city} | {slot.date} | {slot.start_time} - {slot.end_time}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className={`slot-button ${selectedSlot === null ? "disabled-btn" : "active-btn"}`}
            disabled={selectedSlot === null}
          >
            Reserve
          </button>
        </form>
      )}

      {/* Login button always visible */}
      // Then in JSX
<button type="button" onClick={handleSlotLogin} className="login-button">
  Login
</button>
    </div>
  );
};

export default SlotReservationPage;
