import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  let loggedInUser = null;
  try {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser && storedUser !== "undefined") {
      loggedInUser = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Error parsing loggedInUser from localStorage:", err);
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login"); // redirect to login after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Mobile Bio Lab</Link>
      </div>

      <ul className="navbar-links">
        {/* Always show Home if logged in */}
        {loggedInUser && (
          <li>
            <Link to="/">Home</Link>
          </li>
        )}

        {/* Role-based dashboard links */}
        {loggedInUser?.role === "admin" && (
          <li>
            <Link to="/admin-dashboard">Admin Dashboard</Link>
          </li>
        )}
        {loggedInUser?.role === "user" && (
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        )}

        {/* Auth buttons */}
        {loggedInUser ? (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
