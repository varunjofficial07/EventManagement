import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Home, BookOpen, BarChart3, Lock, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "@/context/AuthContext";

export default function TopNav() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate("/", { replace: true });
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    return user.full_name || user.name || user.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    if (user?.profile_image_url) {
      return <img src={user.profile_image_url} alt={getUserDisplayName()} className="w-8 h-8 rounded-full object-cover" />;
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-secondary flex items-center justify-center text-white font-semibold text-sm">
        {getUserDisplayName().charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-primary-600 to-secondary bg-clip-text text-transparent"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-600 to-secondary flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            EventHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary-600 font-medium transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/browse"
              className="text-foreground hover:text-primary-600 font-medium transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4" />
              Browse Events
            </Link>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated || !user ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-foreground font-medium hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary text-white rounded-lg font-medium hover:shadow-lg hover:from-primary-700 transition-all"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg font-medium hover:bg-muted/70 transition-colors"
                >
                  {getUserAvatar()}
                  <span className="hidden lg:inline">{getUserDisplayName()}</span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg border border-border shadow-lg z-50">
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        {getUserAvatar()}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{getUserDisplayName()}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs text-muted-foreground capitalize mt-1">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      {user.role === "user" && (
                        <Link
                          to="/user/home"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                        >
                          <Home className="w-4 h-4" />
                          My Dashboard
                        </Link>
                      )}

                      {user.role === "organizer" && (
                        <Link
                          to="/organizer/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                        >
                          <BarChart3 className="w-4 h-4" />
                          Organizer Dashboard
                        </Link>
                      )}

                      {user.role === "admin" && (
                        <Link
                          to="/admin/panel"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                        >
                          <Lock className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary-600 font-medium transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                to="/browse"
                className="text-foreground hover:text-primary-600 font-medium transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                Browse Events
              </Link>

              {isAuthenticated && user && user.role === "user" && (
                <Link
                  to="/user/home"
                  className="text-foreground hover:text-primary-600 font-medium transition-colors py-2 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  My Dashboard
                </Link>
              )}

              {isAuthenticated && user && user.role === "organizer" && (
                <Link
                  to="/organizer/dashboard"
                  className="text-foreground hover:text-primary-600 font-medium transition-colors py-2 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <BarChart3 className="w-4 h-4" />
                  Organizer Dashboard
                </Link>
              )}

              {isAuthenticated && user && user.role === "admin" && (
                <Link
                  to="/admin/panel"
                  className="text-foreground hover:text-primary-600 font-medium transition-colors py-2 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Lock className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}

              <div className="flex flex-col gap-3 pt-2 border-t border-border mt-2">
                {!isAuthenticated || !user ? (
                  <>
                    <Link
                      to="/login"
                      className="px-6 py-2 text-foreground font-medium hover:text-primary-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all w-full text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-6 py-2 border-b border-border mb-2">
                      <p className="font-semibold text-sm">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="px-6 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 justify-center"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
