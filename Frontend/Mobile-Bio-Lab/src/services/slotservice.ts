// src/services/slotservice.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/slots";

export interface Slot {
  id: number;
  city: string;
  date: string;
  start_time: string;
  end_time: string;
  available_seats: number;
}

// ✅ Fetch all available slots
export const getAvailableSlots = async (): Promise<Slot[]> => {
  try {
    const res = await axios.get(`${API_URL}/available`);
    console.log("✅ Available slots API response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching available slots:", error);
    throw error;
  }
};

// ✅ Fetch slots by city
export const getSlotsByCity = async (city: string): Promise<Slot[]> => {
  try {
    const res = await axios.get(`${API_URL}/city/${city}`);
    return res.data;
  } catch (error) {
    console.error(`❌ Error fetching slots for city ${city}:`, error);
    const allSlots = await getAvailableSlots();
    return allSlots.filter(
      (slot) => slot.city.toLowerCase() === city.toLowerCase()
    );
  }
};
