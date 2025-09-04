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
// src/services/userprofileservice.ts
export type UserProfileResponse = {
  user: UserProfile;
};

// --------------------
//  USER OPERATIONS
// --------------------

// Fetch a user profile by ID (normal user)
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

  const data: UserProfileResponse = await res.json(); // explicitly tell TS the shape

  return data.user; // now TypeScript knows we’re returning UserProfile
};


// Fetch currently logged-in user
export const getCurrentUser = async (): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  const res = await fetch("http://localhost:5000/api/profile/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("getCurrentUser failed:", res.status, text);
    throw new Error("Failed to fetch current user");
  }

  return res.json();
};

// --------------------
//  ADMIN OPERATIONS
// --------------------

// Fetch all users (admin)
export const getAllUsersForAdmin = async (): Promise<UserProfile[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found, please login");

  const res = await fetch(
    "http://localhost:5000/api/admin/update-profile/all",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("getAllUsersForAdmin failed:", res.status, text);
    throw new Error("Failed to fetch users for admin");
  }

  return res.json();
};
