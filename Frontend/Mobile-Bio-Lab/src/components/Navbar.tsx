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
      try {
        const parsedUser: User = JSON.parse(storedUser);

        // Validate essential fields
        if (
          parsedUser.id &&
          parsedUser.firstName &&
          parsedUser.email &&
          parsedUser.role &&
          parsedUser.status
        ) {
          setLoggedInUser(parsedUser);
        } else {
          console.warn("Invalid user object in localStorage, clearing...");
          localStorage.removeItem("loggedInUser");
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("loggedInUser");
      }
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
          onClick={() => setMenuOpen((prev) => !prev)}
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

              {/* Dashboard Link based on role */}
              {loggedInUser.role && (
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
