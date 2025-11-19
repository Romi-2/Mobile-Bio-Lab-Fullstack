import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/biology-graphic-clipart-design-free-png.webp";
import "../style/Navbar.css";
import NotificationBell from "./NotificationBell";

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
  const [menuOpen, setMenuOpen] = useState(false);

  // Load user from localStorage with validation
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser: User = JSON.parse(storedUser);

        // Validate required fields
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
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("loggedInUser");
      }
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("token");
      setLoggedInUser(null);
      setMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* Profile Icon */}
        {loggedInUser && (
          <div className="navbar-left">
            <Link to="/profile" className="profile-icon" onClick={closeMenu}>
              <FaUserCircle />
              {loggedInUser.role === "admin" && (
                <span className="user-role-badge">A</span>
              )}
            </Link>
          </div>
        )}

        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Mobile Bio Lab Logo" className="logo-img" />
            <span>Mobile Bio Lab</span>
          </Link>
        </div>

        {/* Hamburger */}
        <div 
          className={`hamburger ${menuOpen ? "active" : ""}`} 
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
                <Link to="/login" onClick={closeMenu}>Login</Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenu}>Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/home" onClick={closeMenu}>Home</Link>
              </li>

              {loggedInUser.role && (
                <li>
                  <Link
                    to={
                      loggedInUser.role === "admin"
                        ? "/adminDashboard"
                        : "/userdashboard"
                    }
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              {/* Notification Bell */}
              <li className="notification-bell">
                <NotificationBell />
              </li>

              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Overlay */}
        {menuOpen && (
          <div 
            className="mobile-overlay active" 
            onClick={closeMenu}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;