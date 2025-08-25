import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  email: string;
  role: "admin" | "user";
  status: "pending" | "approved"; // match backend
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

      const data: { token?: string; user?: User; message?: string } = await response.json();

      if (response.ok && data.user) {
        // ✅ Check status from backend
        if (data.user.status === "pending") {
          setError("⏳ Please wait for approval from admin.");
          return;
        }

        // Save token and user
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));

        // Redirect according to role
        if (data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch {
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
      </div>
    </div>
  );
};

export default Login;
