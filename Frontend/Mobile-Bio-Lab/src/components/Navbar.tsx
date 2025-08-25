import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  let loggedInUser = null;

  try {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser && storedUser !== "undefined") {
      loggedInUser = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Error parsing loggedInUser from localStorage:", err);
    loggedInUser = null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Mobile Bio Lab</Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* Show Dashboard links depending on role */}
        {loggedInUser?.role === "admin" && (
          <li>
            <Link to="/admin-dashboard">Admin Dashboard</Link>
          </li>
        )}

        {loggedInUser?.role === "user" && (
          <li>
            <Link to="/user-dashboard">User Dashboard</Link>
          </li>
        )}

        {/* Auth buttons */}
        {loggedInUser ? (
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("loggedInUser");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
