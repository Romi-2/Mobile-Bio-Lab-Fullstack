import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";   // ✅ import navigation hook
import "../style/Reservation.css";

interface ReservationResponse {
  msg: string;
  id?: number;
}

// Custom type guard to check if error is an AxiosError
function isAxiosError(error: unknown): error is {
  response?: {
    data?: {
      msg?: string;
    };
  };
} {
  return typeof error === "object" && error !== null && "response" in error;
}

const ReservationForm = () => {
  const [form, setForm] = useState<{
    date: string;
    time: string;
    duration: number;
  }>({
    date: "",
    time: "",
    duration: 60,
  });

  const navigate = useNavigate(); // ✅ initialize navigate

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post<ReservationResponse>("/api/reservations", {
        reservation_date: form.date,
        reservation_time: form.time,
        duration: form.duration,
      });
      alert(res.data.msg);

      // ✅ navigate to Sample Page after success
      navigate("/sample");

    } catch (error) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.msg || "Error booking slot");
      } else {
        alert("Error booking slot");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Book a Slot</h2>

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
        className="border p-2 mr-2"
      />

      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        required
        className="border p-2 mr-2"
      />

      <input
        type="number"
        name="duration"
        value={form.duration}
        onChange={handleChange}
        min={30}
        max={180}
        className="border p-2 mr-2"
      />{" "}
      mins

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Reserve
      </button>
    </form>
  );
};

export default ReservationForm;
