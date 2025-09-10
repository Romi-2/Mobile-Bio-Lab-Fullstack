import { useState, useEffect } from "react";
import { sendForgotPasswordEmail } from "../services/forgetpassword";
import "../style/Forgetpasswordpage.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Email validation function
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Debounce validation
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!email) {
        setError("");
        setIsValid(false);
      } else if (!validateEmail(email)) {
        setError("Invalid email address");
        setIsValid(false);
      } else {
        setError("");
        setIsValid(true);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(handler); // cleanup on next change
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const res = await sendForgotPasswordEmail(email);
      setMessage(res.message);
      setEmail("");
    } catch (err: unknown) {
      setMessage((err as { error?: string })?.error || "Something went wrong");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>
        <p className="description">
          Enter your email and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={!isValid} style={{ opacity: isValid ? 1 : 0.5 }}>
            Send Reset Link
          </button>
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
