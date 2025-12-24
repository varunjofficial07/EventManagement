import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "organizer" | "admin";
  allowedRoles?: ("user" | "organizer" | "admin")[];
}

export default function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuthContext();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole || allowedRoles) {
    const userRole = user?.role;
    
    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      if (userRole === "user") {
        return <Navigate to="/user/home" replace />;
      } else if (userRole === "organizer") {
        return <Navigate to="/organizer/dashboard" replace />;
      } else if (userRole === "admin") {
        return <Navigate to="/admin/panel" replace />;
      }
      return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole as any)) {
      // Redirect to appropriate dashboard based on role
      if (userRole === "user") {
        return <Navigate to="/user/home" replace />;
      } else if (userRole === "organizer") {
        return <Navigate to="/organizer/dashboard" replace />;
      } else if (userRole === "admin") {
        return <Navigate to="/admin/panel" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

