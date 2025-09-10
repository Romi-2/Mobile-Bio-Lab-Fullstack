import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../style/AdminDashboard.css"; 

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // explicit type

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h2>Admin Panel</h2>
        <nav className="menu" role="navigation" aria-label="Admin Menu">
          <ul>
            <li>
              <NavLink
                to="pending"
                className={({ isActive }) =>
                  `menu-link ${isActive ? "active" : ""}`
                }
                onClick={closeSidebar}
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
                onClick={closeSidebar}
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
                onClick={closeSidebar}
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
                onClick={closeSidebar}
              >
                Reports
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <button
          className="hamburger"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          onClick={toggleSidebar}
        >
          &#9776;
        </button>

        <Outlet />
      </main>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="overlay" onClick={closeSidebar} aria-hidden="true" />
      )}
    </div>
  );
};

export default AdminDashboard;
