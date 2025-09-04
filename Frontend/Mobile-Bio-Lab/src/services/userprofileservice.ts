// src/services/userprofileservice.ts

// Unified type that matches your DB + backend
export type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  city: string;
  status: string;
  vu_id: string;
  mobile: string;
  profilePicture: string | null;
};

// --------------------
//  USER PROFILE
// --------------------

// Fetch a user profile by ID (view-only, normal user/admin)
export const getUserProfile = async (id: number): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("getUserProfile failed:", res.status, text);
    throw new Error("Failed to fetch user profile");
  }

  return res.json();
};

// Fetch currently logged-in user (self profile)
export const getCurrentUser = async (): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  const res = await fetch("http://localhost:5000/api/profile/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("getCurrentUser failed:", res.status, text);
    throw new Error("Failed to fetch current user");
  }

  return res.json();
};
