import { createContext } from "react";

export type User = {
  id: string;
  userRole: "ROLE_USER" | "ROLE_ADMIN";
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => void;
};

export type LoginInput = {
  phoneNumber: string;
  password: string;
};

export type SignupInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);