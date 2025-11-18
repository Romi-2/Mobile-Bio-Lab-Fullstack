
// frontend/src/services/userService.ts
import axios from "axios";

// ------------------------
// Base URLs
const AUTH_API_URL = "http://localhost:5000/api/auth"; // Public: register
const LOGIN_API_URL = "http://localhost:5000/api/login";
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
  profilePicture?: string;
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
  axios.post(`${AUTH_API_URL}/register`, data, {
    headers:
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
  });

// ------------------------
// LOGIN (public)
// WRONG - adds extra /login → causes 404
// axios.post(`${LOGIN_API_URL}/login`, data, ...

// ✅ CORRECT
export const loginUser = (data: { email: string; password: string }) =>
  axios.post(`${LOGIN_API_URL}`, data, {
    headers: { "Content-Type": "application/json" },
  });


// ------------------------
// Protected user routes
export const getUsers = () =>
  axios.get<User[]>(`${USER_API_URL}`, { headers: getAuthHeaders() });

export const getUserById = (id: number) =>
  axios.get<User>(`${USER_API_URL}/${id}`, { headers: getAuthHeaders() });

export const updateUser = (id: number, data: Partial<User>) =>
  axios.put<User>(`${USER_API_URL}/${id}`, data, { headers: getAuthHeaders() });

export const deleteUser = (id: number) => {
  return axios.delete(`${USER_API_URL}/${id}`, { headers: getAuthHeaders() });
};