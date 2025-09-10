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
  const storedUser = localStorage.getItem("loggedInUser");

  let user: User | null = null;
  try {
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser) as User;
    }
  } catch {
    user = null; // invalid JSON → treat as not logged in
  }

  const userRole = user?.role?.trim().toLowerCase() || "";

  const isAllowed =
    userRole && allowedRoles.map((r) => r.toLowerCase()).includes(userRole);

  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
