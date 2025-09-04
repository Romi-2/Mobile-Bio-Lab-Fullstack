// src/services/updateprofileservice.ts

// Admin user type
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

// --------------------
//  ADMIN OPERATIONS
// --------------------

// Fetch all users (admin only)
export const getAllUsersForAdmin = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const res = await fetch("http://localhost:5000/api/admin/update-profile/all", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("getAllUsersForAdmin failed:", res.status, text);
    throw new Error("Failed to fetch users for admin");
  }

  return res.json();
};

// Admin updates user by ID
export const adminUpdateUser = async (
  id: number,
  formData: FormData
): Promise<User> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const res = await fetch(
    `http://localhost:5000/api/admin/update-profile/${id}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("adminUpdateUser failed:", res.status, text);
    throw new Error("Failed to update user");
  }

  return res.json();
};

// Admin deletes user
export const deleteUserByAdmin = async (
  id: number
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const res = await fetch(`http://localhost:5000/api/admin/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("deleteUserByAdmin failed:", res.status, text);
    throw new Error(`Failed to delete user: ${text}`);
  }

  return res.json();
};
