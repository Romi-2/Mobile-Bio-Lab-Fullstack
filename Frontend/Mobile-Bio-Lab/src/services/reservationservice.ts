// frontend/src/services/reservationService.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/reservations";
const SAMPLE_URL = "http://localhost:5000/api/samples";

export interface ReservationData {
  user_id: number;
  slot_id: number;
}

export interface ReservationResponse {
  msg: string;
  id?: number;
}

// Create reservation
export const createReservation = async (data: ReservationData): Promise<ReservationResponse> => {
  const res = await axios.post<ReservationResponse>(API_URL, data);
  return res.data;
};

// Submit sample data
export interface SampleData {
  reservationId: number;
  sampleId: string;
  sampleType: string;
  collectionDate: string;
  collectionTime: string;
  geoLocation: string;
  temperature: string;
  pH: string;
  salinity: string;
}

export const submitSample = async (data: SampleData) => {
  const res = await axios.post(SAMPLE_URL, data);
  return res.data;
};

// Get pending reservations (admin)
export const getPendingReservations = async () => {
  const res = await axios.get(`${API_URL}/pending`);
  return res.data;
};

// Update reservation status (admin)
export const updateReservationStatus = async (id: number, action: "approve" | "reject") => {
  const res = await axios.put(`${API_URL}/${id}`, { status: action });
  return res.data;
};
