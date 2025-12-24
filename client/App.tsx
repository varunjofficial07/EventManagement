import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BrowseEvents from "./pages/BrowseEvents";
import EventDetails from "./pages/EventDetails";
import Booking from "./pages/Booking";
import UserHome from "./pages/UserHome";
import UserDashboard from "./pages/UserDashboard";
import OrganizerDash from "./pages/OrganizerDash";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route path="/browse" element={<BrowseEvents />} />
              <Route path="/event/:id" element={<EventDetails />} />

              {/* Protected User Routes */}
              <Route
                path="/user/home"
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/:eventId"
                element={
                  <ProtectedRoute requiredRole="user">
                    <Booking />
                  </ProtectedRoute>
                }
              />

              {/* Protected Organizer Routes */}
              <Route
                path="/organizer/dashboard"
                element={
                  <ProtectedRoute requiredRole="organizer">
                    <OrganizerDash />
                  </ProtectedRoute>
                }
              />
              {/* Legacy route redirect */}
              <Route
                path="/organizer"
                element={<Navigate to="/organizer/dashboard" replace />}
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/panel"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              {/* Legacy route redirect */}
              <Route
                path="/admin"
                element={<Navigate to="/admin/panel" replace />}
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
