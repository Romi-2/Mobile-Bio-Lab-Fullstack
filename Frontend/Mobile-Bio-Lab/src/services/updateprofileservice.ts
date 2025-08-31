// Define the User type used for admin operations
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  role: string;
  status: string;
  vu_id: string;
  mobile: string;
  profilePicture: string | null;
};

// Fetch all users (for admin)
export const getAllUsersForAdmin = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch("http://localhost:5000/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("getAllUsersForAdmin failed:", res.status, text);
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

// Delete a user (for admin)
export const deleteUserByAdmin = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("deleteUserByAdmin failed:", res.status, text);
    throw new Error("Failed to delete user");
  }

  return res.json();
};
