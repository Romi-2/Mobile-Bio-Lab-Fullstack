import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type User = {
  email: string;
  password: string;
  role: "admin" | "user"; // ✅ strict role type
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // ✅ tell TS the shape of backend response
      const data: { user: User; message?: string } = await response.json();

      if (response.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user)); // no error now
        alert("Login successful!");

        if (data.user.role === "admin") {
          navigate("/dashboard"); // admins go to dashboard
        } else {
          navigate("/home"); // normal users go home
        }
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-row">
            <div className="input-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="button-row">
            <button type="submit">Login</button>
          </div>
        </form>
        <p className="switch-text">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
