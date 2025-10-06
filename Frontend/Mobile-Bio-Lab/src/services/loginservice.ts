// frontend/src/services/loginservice.ts
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
  status: "pending" | "approved" | "rejected";
  city?: string;
};

export type LoginResponse = {
  token?: string;
  user?: User;
  message?: string;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Login service error:", error);
    throw new Error("Unable to connect to the server");
  }
};
