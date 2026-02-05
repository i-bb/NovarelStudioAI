// AuthContext.tsx
import { createContext, useContext } from "react";
import type { User } from "@/lib/api/api";

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (payload: any) => Promise<any>;
  refreshUser: () => Promise<User>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
