// frontend/src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/Login.css";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
  status: "pending" | "approved" | "rejected";
  city?: string;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profileData = await response.json();

      if (response.ok) {
        console.log("✅ User Profile:", profileData);
        localStorage.setItem("profile", JSON.stringify(profileData));
      } else {
        console.error("❌ Failed to fetch profile:", profileData.message);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Frontend validations
    if (!validateEmail(trimmedEmail)) {
      setError("❌ Please enter a valid email address.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("❌ Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      const data: { token?: string; user?: User; message?: string } = await response.json();

      if (response.ok && data.user && data.token) {
        const status = data.user.status.trim().toLowerCase();

        if (status === "pending") {
          setError("⏳ Your account is pending approval.");
          return;
        }

        if (status === "rejected") {
          setError("❌ Your account has been rejected.");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);

        await fetchProfile();

        navigate("/home");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button type="submit">Login</button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="login-links">
          <Link to="/forgotPassword">Forgot Password?</Link>
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
