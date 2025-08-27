import axios from "axios";
import type { User } from "./adminservice"; // your shared type

const API = "http://localhost:5000/api/users";
const getToken = () => localStorage.getItem("token");

interface UsersResponse {
  users: User[];
}

export const getAllUsers = async (): Promise<User[]> => {
  const token = getToken();
  const res = await axios.get<UsersResponse>(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.users; // TypeScript now knows this is User[]
};

export const deleteUser = async (id: number): Promise<void> => {
  const token = getToken();
  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
