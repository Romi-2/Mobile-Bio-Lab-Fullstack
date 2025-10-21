// frontend/src/pages/Dashboard/AdminDashboard.tsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../style/AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    try {
      setIsSidebarOpen(prev => !prev);
    } catch (err) {
      console.error("Failed to toggle sidebar:", err);
      setError("Something went wrong while toggling the sidebar.");
    }
  };

  const closeSidebar = () => {
    try {
      setIsSidebarOpen(false);
    } catch (err) {
      console.error("Failed to close sidebar:", err);
      setError("Something went wrong while closing the sidebar.");
    }
  };

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
            <li>
              <NavLink
                to="admin/reservations"
                className={({ isActive }) =>
                  `menu-link ${isActive ? "active" : ""}`
                }
                onClick={closeSidebar}
              >
                Reservation
              </NavLink>
            </li>

            <li>
              <NavLink
  to="/adminDashboard/sample/1"  // Use absolute path
  className={({ isActive }) =>
    `menu-link share-link ${isActive ? "active" : ""}`
  }
  onClick={closeSidebar}
>
  Share Sample
</NavLink>

            </li>
            <li>
              <NavLink
                to="protocols"  // Changed from /dashboard/protocols
                className={({ isActive }) =>
                  `menu-link ${isActive ? "active" : ""}`
                }
                onClick={closeSidebar}
              >
                Manage Protocols
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

        {/* Error fallback for Outlet */}
        {error && <div className="error-message">{error}</div>}
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="overlay" onClick={closeSidebar} aria-hidden="true" />
      )}
    </div>
  );
};

export default AdminDashboard;

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("Error in Outlet:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-message">Something went wrong while loading content.</div>;
    }
    return this.props.children;
  }
}