import axios from "axios";

const API_URL = "http://localhost:5000/api";

// User type
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  city: string;
}

// CREATE (register)
export const createUser = (data: FormData) =>
  axios.post<User>(`${API_URL}/users/register`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// READ
export const getUsers = () => axios.get<User[]>(`${API_URL}/users`);

// UPDATE
export const updateUser = (id: number, data: Partial<User>) =>
  axios.put<User>(`${API_URL}/users/${id}`, data);

// DELETE
export const deleteUser = (id: number) =>
  axios.delete(`${API_URL}/users/${id}`);
