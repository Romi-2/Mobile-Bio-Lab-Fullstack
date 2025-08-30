// src/services/userprofileservice.ts
export type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  city: string;
  status: string;
  vu_id: string;
  vuEmailAddress: string;
  mobile: string;
  profilePicture: string | null; // ✅ match DB column
};

// Fetch profile by ID
export const getUserProfile = async (id: number): Promise<UserProfile> => {
  const res = await fetch(`http://localhost:5000/api/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
};

// Fetch currently logged-in user
export const getCurrentUser = async (): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  const res = await fetch("http://localhost:5000/api/profile/me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("getCurrentUser failed:", res.status, text);
    throw new Error("Failed to fetch current user");
  }

  const data = await res.json();
  return data; // backend already returns the user object
};

// Update profile
export const updateUserProfile = async (id: number, formData: FormData) => {
  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update user profile");
  return res.json();
};

