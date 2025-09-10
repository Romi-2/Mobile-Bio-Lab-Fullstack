// resetpasswordpage.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../style/reserpasswordpage.css";

interface ResetPasswordResponse {
  message: string;
}

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false); // button state

  // Password validation function
  const validatePassword = (pwd: string) => {
    const minLength = 8;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (pwd.length < minLength) return "Password must be at least 8 characters long";
    if (!regex.test(pwd))
      return "Password must contain uppercase, lowercase, number, and special character";
    return "";
  };

  // Enable/disable button dynamically
  useEffect(() => {
    const pwdError = validatePassword(password);
    if (!pwdError && password === confirmPassword && password !== "") {
      setIsValid(true);
      setError(""); // clear previous error
    } else {
      setIsValid(false);
      if (password !== confirmPassword && confirmPassword !== "") {
        setError("Passwords do not match");
      } else {
        setError(pwdError);
      }
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    try {
      const res = await axios.post<ResetPasswordResponse>(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.message);
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setMessage(err.response?.data?.error || "Something went wrong");
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  return (
    <div className="reset-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ position: "relative", marginBottom: "10px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

        <div style={{ marginBottom: "10px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <button type="submit" disabled={!isValid} style={{ opacity: isValid ? 1 : 0.5 }}>
          Reset Password
        </button>
      </form>

      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
