import api from "@/lib/axios";
import type { User } from "@/types/types";

export interface UserListItem {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: "ACTIVE" | "SUSPENDED";
  balance: number;
}

export const getUser = async (): Promise<User> => {
  const { data } = await api.get("/users/me");
  return data;
};

export const getUsersCount = async (): Promise<number> => {
  const { data } = await api.get("/users/count");
  return data;
};

export const getUserById = async (id: string): Promise<UserListItem> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const getUsersList = async (keyword = ""): Promise<UserListItem[]> => {
  const { data } = await api.get("/users", { params: { keyword } });
  return data;
};

export const updateUserStatus = async (userId: string, status: "ACTIVE" | "SUSPENDED"): Promise<void> => {
  await api.patch(`/users/${userId}/status`, { userStatus: status });
};