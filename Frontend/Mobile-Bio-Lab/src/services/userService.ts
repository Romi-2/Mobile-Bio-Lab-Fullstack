// src/service/userService.ts
import axios from "axios";

// ------------------------
// Base URLs
const AUTH_API_URL = "http://localhost:5000/api/auth"; // Public: register & login
const USER_API_URL = "http://localhost:5000/api/users"; // Protected: CRUD

// ------------------------
// User type
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  vuId?: string;
  email: string;
  password?: string;
  mobile?: string;
  role: string;
  city?: string;
  profilePic?: string;
}

// ------------------------
// Helper: get auth headers (protected endpoints)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ------------------------
// REGISTER (public)
export const registerUser = (data: FormData | User) =>
  axios.post(
    `${AUTH_API_URL}/register`,
    data,
    {
      headers: data instanceof FormData
        ? { "Content-Type": "multipart/form-data" } // No auth header
        : { "Content-Type": "application/json" },
    }
  );

// ------------------------
// LOGIN (public)
export const loginUser = (data: { email: string; password: string }) =>
  axios.post(`${AUTH_API_URL}/login`, data, {
    headers: { "Content-Type": "application/json" },
  });

// ------------------------
// GET all users (protected)
export const getUsers = () =>
  axios.get<User[]>(`${USER_API_URL}`, { headers: getAuthHeaders() });

// GET single user by ID (protected)
export const getUserById = (id: number) =>
  axios.get<User>(`${USER_API_URL}/${id}`, { headers: getAuthHeaders() });

// UPDATE user (protected)
export const updateUser = (id: number, data: Partial<User>) =>
  axios.put<User>(`${USER_API_URL}/${id}`, data, { headers: getAuthHeaders() });

// DELETE user (protected)
export const deleteUser = (id: number) =>
  axios.delete(`${USER_API_URL}/${id}`, { headers: getAuthHeaders() });
