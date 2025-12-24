import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, user, loading } = useAuthContext();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect authenticated users away from public routes (login/register)
  if (isAuthenticated && user) {
    const userRole = user.role;
    if (userRole === "admin") {
      return <Navigate to="/admin/panel" replace />;
    } else if (userRole === "organizer") {
      return <Navigate to="/organizer/dashboard" replace />;
    } else if (userRole === "user") {
      return <Navigate to="/user/home" replace />;
    }
  }

  return <>{children}</>;
}

