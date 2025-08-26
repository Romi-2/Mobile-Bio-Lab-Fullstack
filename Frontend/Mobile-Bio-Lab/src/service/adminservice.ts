// adminservice.ts
import axios from "axios";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // "student" | "researcher" | "technician" | "admin"
  city: string;
  profilePicture?: string;
}

const API_URL = "http://localhost:5000/api/admin";

// Get JWT token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch ALL users
export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get<{ users: User[] }>(
    `${API_URL}/users`,
    { headers: getAuthHeaders() }
  );
  return response.data.users;
};

// Fetch pending users
export const getPendingUsers = async (): Promise<User[]> => {
  const response = await axios.get<{ users: User[] }>(
    `${API_URL}/pending-users`,
    { headers: getAuthHeaders() }
  );
  return response.data.users;
};

// Approve user
export const approveUser = async (id: number) => {
  await axios.post(`${API_URL}/approve/${id}`, {}, { headers: getAuthHeaders() });
};

// Reject user
export const rejectUser = async (id: number) => {
  await axios.post(`${API_URL}/reject/${id}`, {}, { headers: getAuthHeaders() });
};

// Delete user
export const deleteUser = async (id: number) => {
  await axios.delete(`${API_URL}/delete/${id}`, { headers: getAuthHeaders() });
};

// ✅ Update user
export const updateUser = async (id: number, updatedData: Partial<User>) => {
  const response = await axios.put(
    `${API_URL}/update/${id}`,
    updatedData,
    { headers: getAuthHeaders() }
  );
  return response.data;
};
