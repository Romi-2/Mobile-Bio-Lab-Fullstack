// frontend/src/services/shareService.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/share";

export const sendShareEmail = async (email: string, sampleId: string, sampleName: string) => {
  const response = await axios.post(`${API_URL}/email`, { email, sampleId, sampleName });
  return response.data;
};

export const getShareLink = async (sampleId: string) => {
  const response = await axios.get(`${API_URL}/link/${sampleId}`);
  return response.data;
};
