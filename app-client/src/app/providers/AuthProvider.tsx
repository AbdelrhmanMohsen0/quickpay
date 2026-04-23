import { useEffect, useState, useCallback } from "react";
import {
  AuthContext,
  type User,
  type LoginInput,
  type SignupInput,
} from "./AuthContext";
import api from "@/lib/axios";
import { jwtDecode } from "jwt-decode";

type Props = {
  children: React.ReactNode;
};

type JwtPayload = {
  exp: number;
};

const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Helper function to pause execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Core fetch function (throws error if it fails, so callers can catch/retry)
  const fetchUser = useCallback(async () => {
    const res = await api.get<User>("/users/me");
    setUser(res.data);
    return res.data;
  }, []);

  // ================================
  // Init (restore session)
  // ================================
  useEffect(() => {
    const initSession = async () => {
      const token = localStorage.getItem("access_token");

      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("access_token");
        setLoading(false);
        return;
      }

      try {
        await fetchUser();
      } catch (error) {
        // If it fails on initial load, the token is likely invalid or revoked
        localStorage.removeItem("access_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [fetchUser]);

  // ================================
  // Robust Fetch with Retries
  // ================================
  const fetchUserWithRetry = async (maxRetries = 5, delayMs = 1500) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await fetchUser();
        return; // Success! Exit the loop.
      } catch (error) {
        if (attempt === maxRetries) {
          // If we exhausted all retries, fail cleanly
          localStorage.removeItem("access_token");
          setUser(null);
          throw new Error("Failed to fetch user profile after multiple attempts.");
        }
        // Wait before trying again
        await delay(delayMs);
      }
    }
  };

  // ================================
  // Login
  // ================================
  const login = async (data: LoginInput) => {
    const res = await api.post("/auth/login", data);
    const token = res.data?.token;

    localStorage.setItem("access_token", token);
    
    setIsProvisioning(true);
    try {
      await fetchUserWithRetry();
    } finally {
      setIsProvisioning(false);
    }
  };

  // ================================
  // Signup
  // ================================
  const signup = async (data: SignupInput) => {
    const res = await api.post("/auth/signup", data);
    const token = res.data?.token;

    localStorage.setItem("access_token", token);
    
    setIsProvisioning(true);
    try {
      await fetchUserWithRetry();
    } finally {
      setIsProvisioning(false);
    }
  };

  // ================================
  // Logout
  // ================================
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);

    window.location.href = "/auth";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || isProvisioning, // Block rendering main app while provisioning
        login,
        signup,
        logout,
      }}
    >
      {loading || isProvisioning ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-medium animate-pulse">
              {loading && "Loading..."} {isProvisioning && "Preparing your account..."}
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
