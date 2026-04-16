import { useEffect, useState } from "react";
import {
  AuthContext,
  type User,
  type LoginInput,
  type SignupInput,
} from "./AuthContext";
import api from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

type JwtPayload = {
  sub: string;
  roles: ("ROLE_USER" | "ROLE_ADMIN")[];
  exp: number;
};

const extractUserFromToken = (token: string): User => {
  const decoded = jwtDecode<JwtPayload>(token);

  return {
    id: decoded.sub,
    userRole: decoded.roles[0],
  };
};

const isTokenExpired = (token: string) => {
  const decoded = jwtDecode<JwtPayload>(token);
  return decoded.exp * 1000 < Date.now();
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();
  // ================================
  // Init (restore session)
  // ================================
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token || isTokenExpired(token)) {
      setLoading(false);
      return;
    }

    try {
      const user = extractUserFromToken(token);
      setUser(user);
    } catch {
      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ================================
  // Login
  // ================================
  const login = async (data: LoginInput) => {
    const res = await api.post("/auth/login", data);

    const token = res.data;

    localStorage.setItem("access_token", token);
    setUser(extractUserFromToken(token));
  };

  // ================================
  // Signup
  // ================================
  const signup = async (data: SignupInput) => {
    const res = await api.post("/auth/signup", data);

    const token = res.data;

    localStorage.setItem("access_token", token);
    setUser(extractUserFromToken(token));
  };

  // ================================
  // Logout
  // ================================
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);

    window.location.href = "/auth/login";
    // navigate("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
