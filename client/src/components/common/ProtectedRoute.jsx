import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ role }) {
  const { isAuthenticated, user, bootstrapping } = useAuth();
  const location = useLocation();

  if (bootstrapping) {
    return <LoadingSpinner label="Preparing your portal..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace state={{ from: location }} />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return <Outlet />;
}
