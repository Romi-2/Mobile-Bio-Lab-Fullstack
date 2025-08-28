// src/services/userslistservice.ts
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  profilePicture?: string;
  role: "admin" | "user";
  status?: "pending" | "approved" | "rejected";
};

// Fetch all users (for admin dashboard)
export const getAllUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please login.");
  }

  const res = await fetch("http://localhost:5000/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized. Please login again.");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.users || [];
};

// Delete a user by ID
export const deleteUser = async (id: number) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please login.");
  }

  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized. Please login again.");
  }

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
};
