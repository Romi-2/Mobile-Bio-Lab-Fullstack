import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/userService"; // 👈 Ensure correct path
import axios from "axios";
import "../style/Login.css";

// ✅ Define User type (used in API response)
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

  // ✅ Email validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // ✅ Fetch user profile after login
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

  // ✅ Handle Login
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
      // ✅ Use Axios service instead of fetch
      const response = await loginUser({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      // ✅ Type response properly
      const data: { token?: string; user?: User; message?: string } = response.data;

      if (data?.token && data?.user) {
        const status = data.user.status?.trim().toLowerCase();

        if (status === "pending") {
          setError("⏳ Your account is pending approval.");
          return;
        }

        if (status === "rejected") {
          setError("❌ Your account has been rejected.");
          return;
        }

        // ✅ Store user & token
        // Store user & token
localStorage.setItem("token", data.token);
localStorage.setItem("loggedInUser", JSON.stringify(data.user));
localStorage.setItem("role", data.user.role);

console.log("✅ Logged in user:", data.user);

// ✅ Navigate first
navigate("/home");

// ✅ Then fetch profile
fetchProfile();

      } else {
        setError(data.message || "❌ Invalid email or password.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message || "⚠️ Unable to login. Please try again later.";
        setError(`❌ ${message}`);
      } else {
        setError("⚠️ Something went wrong. Please try again later.");
      }
    }
  };

  // ✅ UI Section
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

          <button type="submit" className="login-btn">Login</button>
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
