// frontend/src/services/reservationService.ts
import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:5000/api/reservations";

export interface ReservationData {
  user_id: number;
  reservation_date: string; // YYYY-MM-DD
  reservation_time: string; // HH:mm:ss
  duration?: number;
  status?: string;
}

export interface ReservationResponse {
  msg: string;
  id?: number;
}

export const createReservation = async (
  data: ReservationData
): Promise<ReservationResponse> => {
  try {
    const response = await axios.post<ReservationResponse>(API_URL, data);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ msg: string }>;
      throw new Error(
        axiosError.response?.data?.msg ||
          axiosError.message ||
          "Reservation failed"
      );
    }
    throw new Error("❌ Unknown error occurred while creating reservation");
  }
};

// ✅ Get all pending reservations
export const getPendingReservations = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.reservations;
};

// ✅ Approve or Reject reservation
export const updateReservationStatus = async (id: number, action: "approve" | "reject") => {
  const token = localStorage.getItem("token");
  await axios.post(
    `${API_URL}/${action}/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};