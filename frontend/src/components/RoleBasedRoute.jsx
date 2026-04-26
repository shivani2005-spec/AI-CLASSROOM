import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_DASHBOARDS = {
  teacher: "/teacher-dashboard",
  principal: "/principal-dashboard",
  admin: "/admin",
  student: "/dashboard",
};

/**
 * Allows only users with the specified role(s) to access the route.
 * Others are redirected to their role-appropriate dashboard.
 */
export default function RoleBasedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/signin" replace />;

  if (!allowedRoles.includes(user.role)) {
    const fallback = ROLE_DASHBOARDS[user.role] || "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
