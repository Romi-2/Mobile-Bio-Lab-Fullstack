// src/service/userprofileservice.ts
export type UserProfileUpdate = {
  email: string;
  city: string;
  profilePic?: File | null;
};

export const updateUserProfile = async (id: number, formData: FormData) => {
  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update user profile");
  return res.json();
};
