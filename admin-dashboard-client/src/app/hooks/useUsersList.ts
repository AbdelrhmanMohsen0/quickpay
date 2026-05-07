import { useCallback, useEffect, useState } from "react";
import { getUsersList, type UserListItem } from "@/services/userService";

export const useUsersList = (keyword = "") => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getUsersList(keyword)
      .then((data) => setUsers(data))
      .catch((err: any) => {
        setError(err.response?.data?.message ?? "Failed to fetch users");
      })
      .finally(() => setLoading(false));
  }, [keyword, tick]);

  return { users, loading, error, refetch };
};
