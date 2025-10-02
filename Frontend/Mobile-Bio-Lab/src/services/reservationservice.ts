// frontend/src/services/reservationservice.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/reservations";

interface ReservationData {
  // Add appropriate fields, for example:
  date: string;
  time: string;
  userId: string;
  // Add other fields as needed
}

export const createReservation = async (reservationData: ReservationData) => {
  const res = await axios.post(API_URL, reservationData);
  return res.data;
};
