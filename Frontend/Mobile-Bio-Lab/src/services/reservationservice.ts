// src/services/reservationservice.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/reservations";

export interface ReservationData {
  user_id: number;
  slot_id: number;
  reservation_date: string;
  reservation_time: string;
  duration: string;
  status: string;
  sample_id: string;
  sample_type: string;
  collection_date: string;
  collection_time: string;
  geo_location: string;
  temperature: string;
  pH: string;
  salinity: string;
}

// ✅ Create a reservation
export const createReservation = async (data: ReservationData) => {
  const token = localStorage.getItem("token"); // or sessionStorage, depending on where you stored it

  const response = await axios.post(`${API_URL}/reserve`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

