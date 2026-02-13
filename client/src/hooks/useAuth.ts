import { useState, useEffect } from "react";
import api, { User } from "@/lib/api/api";
import { toast } from "./use-toast";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTopPlan = user?.active_plan?.name === "Studio";
  const totalStorage = user?.active_plan?.meta_data_json?.total_storage_mb || 0;
  const totalStorageGB = Number((totalStorage / 1024).toFixed(2));
  const usedStorage = user?.active_plan?.meta_data_json?.used_storage_mb || 0;
  const usedStorageGB = Number((usedStorage / 1024).toFixed(2));
  const isStorageWarningLimit =
    user?.active_plan?.meta_data_json?.storage_warning_threshold_reached ||
    false;
  const totalStorageUsagePercentage =
    totalStorageGB > 0 ? (usedStorageGB / totalStorageGB) * 100 : 0;
  // ───────────────────────────────
  // Load stored auth on startup
  // ───────────────────────────────
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const savedToken = localStorage.getItem("auth_token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  // ───────────────────────────────
  // PUBLIC: Refresh User After Subscription
  // ───────────────────────────────
  const refreshUser = async () => {
    try {
      const res = await api.userDetails();

      // Update state
      setUser(res);

      // Update localStorage
      localStorage.setItem("auth_user", JSON.stringify(res));

      return res;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      throw error;
    }
  };

  // ───────────────────────────────
  // LOGIN
  // ───────────────────────────────
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);

      setUser(res.user);
      setToken(res.access_token);

      localStorage.setItem("auth_user", JSON.stringify(res.user));
      localStorage.setItem("auth_token", res.access_token);

      return res.user;
    } catch (error: any) {
      console.log("error", error);

      const message =
        error.response?.data?.description ||
        error.message ||
        "Invalid email or password";

      toast({
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ───────────────────────────────
  // SIGNUP
  // ───────────────────────────────
  const signup = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await api.signup(payload);

      setUser(res.user);
      setToken(res.access_token || "");

      localStorage.setItem("auth_user", JSON.stringify(res.user));
      if (res.access_token) {
        localStorage.setItem("auth_token", res.access_token);
      }

      return res.user;
    } catch (error: any) {
      let message = "Failed to create account. Please try again.";

      if (error.type === "SERVER_ERROR") {
        const desc = error?.description;

        if (typeof desc === "string") {
          message = desc;
        } else if (Array.isArray(desc) && desc[0]?.message) {
          message = desc[0].message;
        } else if (typeof desc === "object" && desc?.message) {
          message = desc.message;
        } else if (error?.message) {
          message = error.message;
        }
      } else if (error.type === "NO_RESPONSE") {
        message = "Unable to reach the server. Check your internet connection.";
      } else if (error.type === "REQUEST_NOT_SENT") {
        message = "Something went wrong before sending the request.";
      }

      toast({
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    isTopPlan,
    totalStorageGB,
    usedStorageGB,
    isStorageWarningLimit,
    totalStorageUsagePercentage,

    login,
    signup,

    refreshUser,
  };
}
