// frontend/src/pages/Dashboard/UserDashboard.tsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../style/UserDashboard.css";

const UserDashboard: React.FC = () => {
  return (
    <div className="user-dashboard">
      {/* SIDEBAR ONLY */}
      <aside className="sidebar">
        <h2>User Dashboard</h2>

        <ul>
          <li>
            <NavLink
              to=""
              end
              className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="delete-account"
              className={({ isActive }) =>
                `menu-link delete-link ${isActive ? "active" : ""}`
              }
              
            >
              Delete Account
            </NavLink>

          </li>

          <li>
            <NavLink
              to="/userdashboard/sample/1"
              className={({ isActive }) =>
                `menu-link share-link ${isActive ? "active" : ""}`
              }
            >
              Share Sample
            </NavLink>
          </li>

          <li>
            <NavLink
              to="protocols"
              className={({ isActive }) =>
                `menu-link ${isActive ? "active" : ""}`
              }
            >
              Protocols & Guidelines
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* CONTENT AREA */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
