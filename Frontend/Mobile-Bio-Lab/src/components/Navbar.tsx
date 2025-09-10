import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/biology-graphic-clipart-design-free-png.webp";

import "../style/Navbar.css";

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
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu toggle

  // Check if user is already logged in
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
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* Profile Icon on left */}
        {loggedInUser && (
          <div className="navbar-left">
            <Link to="/profile" className="profile-icon">
              <FaUserCircle />
            </Link>
          </div>
        )}

        {/* Logo in center */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Mobile Bio Lab Logo" className="logo-img" />
            <span>Mobile Bio Lab</span>
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navbar Links */}
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
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

                            {loggedInUser && (
                <li>
                  <Link
                    to={
                      loggedInUser.role === "admin"
                        ? "/adminDashboard"
                        : "/userdashboard"
                    }
                  >
                    Dashboard
                  </Link>
                </li>
              )}


              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
