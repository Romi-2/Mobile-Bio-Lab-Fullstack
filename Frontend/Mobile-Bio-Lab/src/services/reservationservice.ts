// frontend/src/services/reservationservice.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/reservations";

// services/reservationservice.ts
export interface ReservationData {
  userId: string;
  slotId: string;
  date: string;
  time: string;
  duration?: string;
  status?: string;
  sample_id?: string;
  sample_type?: string;
  collection_date?: string;
  collection_time?: string;
  geo_location?: string;
  temperature?: string;
  pH?: string;
  salinity?: string;
}


export const createReservation = async (reservationData: ReservationData) => {
  const res = await axios.post(API_URL, reservationData);
  return res.data;
};
