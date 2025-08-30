import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
  status: "pending" | "approved" | "rejected";
  city?: string;
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser && storedUser !== "undefined") {
      setLoggedInUser(JSON.parse(storedUser) as User);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    setLoggedInUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-right">
        {/* Profile Icon */}
        <Link to="/Profile" className="profile-icon">
          <FaUserCircle size={24} />
        </Link>
      </div>
      <div className="navbar-logo">
        <Link to="/">Mobile Bio Lab</Link>
      </div>

      <ul className="navbar-links">
        {!loggedInUser ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/home">Home</Link>
            </li>

            {/* ✅ Admin route fixed */}
            {loggedInUser.role === "admin" && (
              <li>
                <Link to="/adminDashboard">Admin Dashboard</Link>
              </li>
            )}

            {loggedInUser.role === "user" && (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            )}

            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
