// frontend/src/services/adminReservationservice.ts
import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:5000/api/admin/reservations";

// ✅ Fetch all reservations (admin side)
export const getAllReservations = async (token: string) => {
  try {
    console.log("🔍 Service: Making request to:", API_URL);
    
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    console.log("✅ Service: Response received:", response.status, response.statusText);
    console.log("✅ Service: Response data type:", typeof response.data);
    console.log("✅ Service: Response data:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Service: Error fetching reservations:");
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Axios error details:");
      console.error("- Status:", axiosError.response?.status);
      console.error("- Status Text:", axiosError.response?.statusText);
      console.error("- Response Data:", axiosError.response?.data);
      console.error("- Message:", axiosError.message);
      
      const errorData = axiosError.response?.data as { message?: string };
      
      throw new Error(
        errorData?.message || 
        `HTTP ${axiosError.response?.status}: ${axiosError.response?.statusText}` ||
        axiosError.message
      );
    } else {
      console.error("Non-Axios error:", error);
      throw new Error("Unexpected error occurred while fetching reservations");
    }
  }
};

// ✅ Update reservation status (approve/reject)
export const updateReservationStatus = async (id: number, status: string, token: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}/status`,
      { status },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating reservation status:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as { message?: string };
      
      throw new Error(
        errorData?.message || 
        `Failed to update reservation: ${axiosError.message}`
      );
    }
    throw error;
  }
};