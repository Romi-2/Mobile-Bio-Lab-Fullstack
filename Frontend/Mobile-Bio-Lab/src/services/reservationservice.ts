// Frontend/Mobile-Bio-Lab/src/services/reservationservice.ts
import axios from "axios";
import type { Slot } from "./slotservice"; // ✅ Import the shared interface

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

// ✅ Unified Slot type now used here too
export const getAvailableSlots = async (): Promise<Slot[]> => {
  const response = await axios.get<Slot[]>(`${API_URL}/available`);
  return response.data;
};

export const createReservation = async (data: ReservationData) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};
