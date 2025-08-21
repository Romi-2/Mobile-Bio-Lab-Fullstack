import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Mobile Bio Lab</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* ✅ Only show Dashboard if user is admin */}
        {loggedInUser?.role === "admin" && (
          <li>
            <Link to="/dashboard">Admin Dashboard</Link>
          </li>
        )}

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
            <Link to="/login">Login</Link> {/* ✅ fixed here */}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
