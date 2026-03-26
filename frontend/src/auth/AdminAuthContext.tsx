import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type AdminAuthContextValue = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const ADMIN_AUTH_STORAGE_KEY = "bank-knowledge-admin-auth";
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin";

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function readStoredAuth() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "true";
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readStoredAuth);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isAuthenticated,
      login: (username: string, password: string) => {
        const passed =
          username.trim() === DEFAULT_ADMIN_USERNAME && password === DEFAULT_ADMIN_PASSWORD;
        setIsAuthenticated(passed);
        return passed;
      },
      logout: () => setIsAuthenticated(false),
    }),
    [isAuthenticated],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
