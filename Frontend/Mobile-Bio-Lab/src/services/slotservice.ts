// frontend/src/services/slotservice.ts
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/slots";

export const getAvailableSlots = async () => {
  const res = await axios.get(`${BASE_URL}/available`);
  return res.data;
};

export const reserveSlot = async (slot_id: number, user_id: number) => {
  const res = await axios.post(`${BASE_URL}/reserve`, { slot_id, user_id });
  return res.data;
};
