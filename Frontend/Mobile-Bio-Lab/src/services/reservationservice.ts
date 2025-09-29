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
