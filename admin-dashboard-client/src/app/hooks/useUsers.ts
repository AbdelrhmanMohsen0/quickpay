import { useEffect, useState } from "react";
import type { User} from "@/types/types";
import { getUser } from "@/services/userService";

export const useUsers = () => {
  const [users, setUser]     = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch (err: any) {
        setError(err.response?.data?.message ?? "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};