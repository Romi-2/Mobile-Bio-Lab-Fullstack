// frontend/src/pages/Dashboard/UserDashboard.tsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../style/UserDashboard.css";

const UserDashboard: React.FC = () => {
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
    <div className="user-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <h2>User Dashboard</h2>
        <nav className="menu" role="navigation" aria-label="User Menu">
          <ul>
            <li>
              <NavLink
                to=""
                end
                className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
                onClick={closeSidebar}
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
                onClick={closeSidebar}
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
                onClick={closeSidebar}
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
                onClick={closeSidebar}
              >
                Protocols & Guidelines
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

export default UserDashboard;

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