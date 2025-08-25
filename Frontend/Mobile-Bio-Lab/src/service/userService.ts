import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// User type
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // optional for creating users
  role: string;
  city?: string;
}

// CREATE (register or add user)
export const createUser = (data: FormData | User) =>
  axios.post<User>(`${API_URL}`, data, {
    headers: data instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  });

// READ all users
export const getUsers = () => axios.get<User[]>(`${API_URL}`);

// READ single user by ID
export const getUserById = (id: number) => axios.get<User>(`${API_URL}/${id}`);

// UPDATE
export const updateUser = (id: number, data: Partial<User>) =>
  axios.put<User>(`${API_URL}/${id}`, data);

// DELETE
export const deleteUser = (id: number) =>
  axios.delete(`${API_URL}/${id}`);
