import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../App.css"; // new (or keep using App.css if you prefer)

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav className="menu">
          <ul>
            <li>
              <NavLink
                to="pending"
                className={({ isActive }) =>
                  `menu-link ${isActive ? "active" : ""}`
                }
              >
                Pending Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="users"
                className={({ isActive }) =>
                  `menu-link ${isActive ? "active" : ""}`
                }
              >
                Users List
              </NavLink>
            </li>
            <li>
              <NavLink
                to="profile"
                className={({ isActive }) =>
                  `menu-link ${isActive ? "active" : ""}`
                }
              >
                Update Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
