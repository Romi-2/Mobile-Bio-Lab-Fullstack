// services/reservationservice.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/reservations";

export interface Reservation {
  id: number;
  user_id: number;
  slot_id: number;
  reservation_date: string;
  reservation_time: string;
  duration: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | string;
  sample_id?: string | null;
  sample_type?: string | null;
  collection_date?: string | null;
  collection_time?: string | null;
  geo_location?: string | null;
  temperature?: string | null;
  pH?: string | null;
  salinity?: string | null;
  created_at: string;
  updated_at: string;
  rejection_reason?: string | null;
  slot_details?: {
    id?: number | null;
    date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    available_seats?: number | null;
    lab_id?: number | null;
    lab_name?: string | null;
  };
}

// ✅ Get reservations for logged-in user
export const getUserReservations = async (): Promise<Reservation[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await axios.get<Reservation[]>(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Cancel a reservation
export const cancelReservation = async (reservationId: number): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  await axios.put(`${API_URL}/${reservationId}/cancel`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create a new reservation
export const createReservation = async (data: Partial<Reservation>): Promise<{ message?: string; success?: boolean }> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const response = await axios.post(`${API_URL}/reserve`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};