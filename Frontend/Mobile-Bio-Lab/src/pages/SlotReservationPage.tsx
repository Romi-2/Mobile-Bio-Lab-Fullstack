import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Slot {
  id: number;
  city: string;
  date: string;
  time: string;
  status: string;
}

const SlotReservationPage: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch available slots
  useEffect(() => {
    axios.get("/api/slots")
      .then(res => setSlots(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    try {
      await axios.post("/api/reservations", { slotId: selectedSlot });
      alert("✅ Slot reserved successfully!");
      navigate("/reservation-success");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to reserve slot.");
    }
  };

  return (
    <div className="Reservation-container">
      <h2>Book a Slot</h2>
      <form onSubmit={handleSubmit}>
        <label>Select an available slot:</label>
        <select
          value={selectedSlot ?? ""}
          onChange={(e) => setSelectedSlot(Number(e.target.value))}
        >
          <option value="">-- Choose a Slot --</option>
          {slots
            .filter((s) => s.status === "available")
            .map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.city} | {slot.date} | {slot.time}
              </option>
            ))}
        </select>
        <button type="submit" disabled={!selectedSlot}>
          Reserve
        </button>
      </form>
    </div>
  );
};

export default SlotReservationPage;
