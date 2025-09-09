import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../style/AdminDashboard.css"; 

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h2>Admin Panel</h2>
        <nav className="menu">
          <ul>
            <li>
              <NavLink
                to="pending"
                className={({ isActive }) =>
                  `menu-link ${isActive ? "active" : ""}`
                }
                onClick={() => setIsSidebarOpen(false)} // auto-close on link click
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
                onClick={() => setIsSidebarOpen(false)}
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
                onClick={() => setIsSidebarOpen(false)}
              >
                Update Profile
              </NavLink>
            </li>
            <li>
            <NavLink
              to="reports"
              className={({ isActive }) =>
                `menu-link ${isActive ? "active" : ""}`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              Reports
            </NavLink>
          </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Hamburger button visible on mobile */}
        <button
          className="hamburger"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          &#9776;
        </button>

        <Outlet />
      </main>

      {/* Optional overlay for mobile */}
      {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default AdminDashboard;
