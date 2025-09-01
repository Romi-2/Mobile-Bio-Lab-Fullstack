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

// Fetch all users for admin
export const getAllUsersForAdmin = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/admin/update-profile/all", {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("getAllUsersForAdmin failed:", res.status, text);
    throw new Error("Failed to fetch users for admin");
  }

  const data = await res.json();

  // Ensure we always return an array
  return Array.isArray(data) ? data : data.users ?? [];
};

// Delete user by admin
export const deleteUserByAdmin = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("deleteUserByAdmin failed:", res.status, text);
    throw new Error("Failed to delete user");
  }

  return res.json();
};
