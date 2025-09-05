import { useState } from "react";
import { sendForgotPasswordEmail } from "../services/forgetpassword";
import "../style/Forgetpasswordpage.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await sendForgotPasswordEmail(email);
      setMessage(res.message);
    } catch (err: unknown) {
      setMessage((err as { error?: string })?.error || "Something went wrong");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>
        <p className="description">
          Enter your email and we’ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {message && (
          <p className={`message ${message.includes("sent") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
