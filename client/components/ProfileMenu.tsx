import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import {
  User,
  LogOut,
  Settings,
  Home,
  BarChart3,
  Lock,
  X,
} from "lucide-react";

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
}

export default function ProfileMenu({ isOpen, onClose, menuRef }: ProfileMenuProps) {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthContext();

  if (!isOpen || !isAuthenticated || !user) return null;

  const getUserDisplayName = () => {
    return user.full_name || user.name || user.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    if (user.profile_image_url) {
      return (
        <img
          src={user.profile_image_url}
          alt={getUserDisplayName()}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary flex items-center justify-center text-white font-semibold">
        {getUserDisplayName().charAt(0).toUpperCase()}
      </div>
    );
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/", { replace: true });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg border border-border shadow-lg z-50"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          {getUserAvatar()}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{getUserDisplayName()}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <p className="text-xs text-muted-foreground capitalize mt-1">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2 space-y-1">
        {/* Role-specific dashboard links */}
        {user.role === "user" && (
          <button
            onClick={() => handleNavigate("/user/home")}
            className="w-full flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm text-left"
          >
            <Home className="w-4 h-4" />
            My Dashboard
          </button>
        )}

        {user.role === "organizer" && (
          <button
            onClick={() => handleNavigate("/organizer/dashboard")}
            className="w-full flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm text-left"
          >
            <BarChart3 className="w-4 h-4" />
            Organizer Dashboard
          </button>
        )}

        {user.role === "admin" && (
          <button
            onClick={() => handleNavigate("/admin/panel")}
            className="w-full flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm text-left"
          >
            <Lock className="w-4 h-4" />
            Admin Panel
          </button>
        )}

        {/* Profile Settings */}
        <button
          onClick={() => handleNavigate("/dashboard")}
          className="w-full flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm text-left"
        >
          <User className="w-4 h-4" />
          Profile Settings
        </button>

        <button
          onClick={() => handleNavigate("/dashboard")}
          className="w-full flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm text-left"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>

        {/* Logout */}
        <div className="border-t border-border mt-2 pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm text-left"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

