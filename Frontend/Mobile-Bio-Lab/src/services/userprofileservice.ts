// src/services/userprofileservice.ts
export type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // allow "student", "admin", "user", etc.
  status: string;
  city: string;
  studentVUId?: string;
  vuEmailAddress?: string;
  mobileNumber?: string;
  profilePicture?: string;
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
  const res = await fetch(`http://localhost:5000/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("getCurrentUser failed:", res.status, text);
    throw new Error("Failed to fetch current user");
  }

  const data = await res.json();
  return data.user; // <-- return the nested user object
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
