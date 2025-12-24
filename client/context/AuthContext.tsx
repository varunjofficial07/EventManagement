import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AuthContextType {
  session: any;
  user: any;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<any>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
