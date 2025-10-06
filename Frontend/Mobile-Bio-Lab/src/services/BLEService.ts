// src/services/bleService.ts
import axios, { AxiosError } from "axios";

const API_BASE = "http://localhost:5000/api";

interface SensorData {
  temperature?: number;
  ph?: number;
  salinity?: number;
  timestamp?: string;
}

/**
 * Send sensor data (e.g., temperature, pH, salinity) to backend
 */
export const sendSensorData = async (data: SensorData) => {
  try {
    const res = await axios.post(`${API_BASE}/sensors`, data);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    console.error("❌ Error sending sensor data:", err);

    throw new Error(
      err.response?.data?.message || "Failed to send sensor data"
    );
  }
};
