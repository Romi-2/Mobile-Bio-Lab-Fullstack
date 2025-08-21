import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  return (
    <nav className="navbar">
      <Link to="/home">Home</Link>
      {loggedInUser && loggedInUser.role === "admin" && (
        <Link to="/dashboard" className="admin-btn">
          Admin Dashboard
        </Link>
      )}
      <Link to="/profile">Profile</Link>
    </nav>
  );
};

export default Navbar;
