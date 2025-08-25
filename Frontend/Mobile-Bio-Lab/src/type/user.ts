// src/types/User.ts
export type UserRole = "admin" | "student" | "teacher" | "technician"; 

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  role: UserRole;  // updated to allow all backend roles
  status: "pending" | "approved" | "rejected";
}
