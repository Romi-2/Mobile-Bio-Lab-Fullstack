// frontend/src/pages/ReservationPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../services/reservationservice";
import type { ReservationData, ReservationResponse } from "../services/reservationservice";
import "../style/Reservation.css";

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ReservationData>({
    user_id: 0, // will be updated after loading user
    reservation_date: "",
    reservation_time: "",
    duration: 60,
    status: "pending",
  });

  // Load logged-in user's ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData((prev) => ({ ...prev, user_id: user.id }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user_id) {
      alert("❌ You must be logged in to make a reservation");
      return;
    }

    try {
      const response: ReservationResponse = await createReservation(formData);
      alert(response.msg);
      // Navigate to sample page with reservation ID
      navigate(`/sample/${response.id}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Reservation Error:", error.message);
        alert(error.message);
      } else {
        console.error("❌ Unknown Reservation Error:", error);
        alert("❌ Unknown error occurred");
      }
    }
  };

  return (
    <div className="reservation-container">
      <form onSubmit={handleSubmit} className="reservation-form">
        <h2>Book a Reservation</h2>
        <input
          type="date"
          name="reservation_date"
          value={formData.reservation_date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="reservation_time"
          value={formData.reservation_time}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          min={15}
          step={15}
          required
        />
        <button type="submit">Reserve</button>
      </form>
    </div>
  );
};

export default ReservationPage;
