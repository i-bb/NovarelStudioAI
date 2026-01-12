// import { useState, useEffect } from "react";
// import api, { User } from "@/lib/api/api"; // your API file

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Load from localStorage on mount
//   useEffect(() => {
//     const savedUser = localStorage.getItem("auth_user");
//     const savedToken = localStorage.getItem("auth_token");

//     if (savedUser && savedToken) {
//       setUser(JSON.parse(savedUser));
//       setToken(savedToken);
//     }
//     setIsLoading(false);
//   }, []);

//   return {
//     user,
//     token,
//     isAuthenticated: !!user,
//     isLoading,

//     // ───────────────────────────────
//     // LOGIN
//     // ───────────────────────────────
//     login: async (email: string, password: string) => {
//       setIsLoading(true);
//       try {
//         const res = await api.login(email, password);

//         const loggedInUser = res.user;
//         const accessToken = res.access_token;

//         // Save in state
//         setUser(loggedInUser);
//         setToken(accessToken);

//         // Save in localStorage
//         localStorage.setItem("auth_user", JSON.stringify(loggedInUser));
//         localStorage.setItem("auth_token", accessToken);
//         return loggedInUser;
//       } catch (error) {
//         throw error;
//       } finally {
//         setIsLoading(false);
//       }
//     },

//     // ───────────────────────────────
//     // SIGNUP
//     // ───────────────────────────────
//     signup: async (payload: any) => {
//       setIsLoading(true);
//       try {
//         const res = await api.signup(payload);

//         const newUser = res.user;
//         const accessToken = res?.access_token;

//         setUser(newUser);
//         setToken(accessToken || "");

//         if (newUser) {
//           localStorage.setItem("auth_user", JSON.stringify(newUser));
//         }
//         if (accessToken) {
//           localStorage.setItem("auth_token", accessToken);
//         }

//         return newUser;
//       } catch (error) {
//         throw error;
//       } finally {
//         setIsLoading(false);
//       }
//     },
//   };
// }

import { useState, useEffect } from "react";
import api, { User } from "@/lib/api/api";
import { toast } from "./use-toast";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    login,
    signup,

    refreshUser,
  };
}
