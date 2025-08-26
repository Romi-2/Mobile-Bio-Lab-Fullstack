import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
  status: "pending" | "approved" | "rejected";
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: { token?: string; user?: User; message?: string } =
        await response.json();

      if (response.ok && data.user) {
        const status = data.user.status.trim().toLowerCase();

        if (status === "pending") {
          setError("⏳ Please wait for approval from admin.");
          return;
        }

        // Save token & user info
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);

        // ✅ Redirect to home instead of dashboard
        navigate("/home");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Try again later.");
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

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {/* ✅ Links for forgot password & register */}
        <div className="login-links">
          <p>
            <Link to="/forgotPassword">Forgot Password?</Link>
          </p>
          <p>
            New user? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
