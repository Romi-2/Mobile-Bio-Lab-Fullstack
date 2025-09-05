import axios from "axios";

export interface ForgotPasswordResponse {
  message: string;
}

export async function sendForgotPasswordEmail(
  email: string
): Promise<ForgotPasswordResponse> {
  const res = await axios.post<ForgotPasswordResponse>(
    "http://localhost:5000/api/auth/forgot-password",
    { email }
  );
  return res.data;
}
