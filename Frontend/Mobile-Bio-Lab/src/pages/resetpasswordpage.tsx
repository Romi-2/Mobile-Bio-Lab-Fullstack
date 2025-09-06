import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../style/reserpasswordpage.css";

interface ResetPasswordResponse {
  message: string;
}

// Custom type guard for Axios errors
function isAxiosError(error: unknown): error is {
  isAxiosError: boolean;
  response?: { data?: { error?: string } };
} {
  if (typeof error === "object" && error !== null) {
    return (error as { isAxiosError?: boolean }).isAxiosError === true;
  }
  return false;
}

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ state
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<ResetPasswordResponse>(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.message);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setMessage(err.response?.data?.error || "Something went wrong");
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ position: "relative", marginBottom: "10px" }}>
          <input
            type={showPassword ? "text" : "password"} // 👁️ toggle
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", paddingRight: "40px" }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "1.2rem",
              userSelect: "none",
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>
          Reset Password
        </button>
      </form>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
