import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../../App.css";

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      {/* Sidebar (30%) */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <Link to="pending">Pending Users</Link>
            </li>
            <li>
              <Link to="users">Users List</Link>
            </li>
            <li>
              <Link to="profile">Update Profile</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content (70%) */}
      <main className="main-content">
        <Outlet /> {/* Where child routes render */}
      </main>
    </div>
  );
};

export default AdminDashboard;
