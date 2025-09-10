// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

interface User {
  role?: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    console.warn("ProtectedRoute: No allowedRoles provided");
    return <Navigate to="/login" replace />;
  }

  let user: User | null = null;
  const storedUser = localStorage.getItem("loggedInUser");

  try {
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser) as User;
    }
  } catch (err) {
    console.error("ProtectedRoute: Failed to parse user from localStorage", err);
    user = null;
  }

  const userRole = user?.role?.trim().toLowerCase() || "";
  const allowedRolesNormalized = allowedRoles.map((r) => r.trim().toLowerCase());

  if (!userRole || !allowedRolesNormalized.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
