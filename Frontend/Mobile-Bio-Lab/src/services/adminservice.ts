import axios from "axios";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  role: string;
  status?: string;
}

const API_URL = "http://localhost:5000/api/admin";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Dashboard stats
export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard-stats`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Pending users
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
