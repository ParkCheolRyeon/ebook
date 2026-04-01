import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { login as authLogin, logout as authLogout, isAuthenticated } from "@/lib/auth";

interface AuthContextValue {
  authenticated: boolean;
  login: (id: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        setAuthenticated(false);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const login = useCallback((id: string, password: string) => {
    const success = authLogin(id, password);
    if (success) setAuthenticated(true);
    return success;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setAuthenticated(false);
  }, []);

  return (
    <AuthContext value={{ authenticated, login, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
