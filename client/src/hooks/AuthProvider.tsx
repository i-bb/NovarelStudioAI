// AuthProvider.tsx
import { useState, useEffect } from "react";
import api, { User } from "@/lib/api/api";
import { AuthContext } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const savedToken = localStorage.getItem("auth_token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const refreshUser = async () => {
    const res = await api.userDetails();

    setUser(res); // 🔥 shared update
    localStorage.setItem("auth_user", JSON.stringify(res));

    return res;
  };

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);

    setUser(res.user);
    setToken(res.access_token);

    localStorage.setItem("auth_user", JSON.stringify(res.user));
    localStorage.setItem("auth_token", res.access_token);

    return res.user;
  };

  const signup = async (payload: any) => {
    const res = await api.signup(payload);

    setUser(res.user);
    setToken(res.access_token);

    localStorage.setItem("auth_user", JSON.stringify(res.user));
    localStorage.setItem("auth_token", res.access_token);

    return res.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
