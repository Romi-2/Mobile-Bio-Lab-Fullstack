import axios from "axios";

// User status type
export interface UserStatus {
  status: "Pending" | "Approved" | "Rejected";
}

// Base URL
const API_URL = "http://localhost:5000/api/users";

// Define a proper type for Axios errors
interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

// Type guard for Axios errors
const isAxiosError = (err: unknown): err is AxiosError => {
  return typeof err === "object" && err !== null && "message" in err;
};

// Get logged-in user's status
export const getUserStatus = async (): Promise<UserStatus> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get<UserStatus>(`${API_URL}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      console.error("Failed to fetch user status:", err.response?.data ?? err.message);
      // wrap in a new Error instead of throwing `any`
      throw new Error(err.response?.data?.message ?? err.message);
    } else {
      console.error("Unexpected error:", err);
      throw new Error("Unexpected error occurred");
    }
  }
};