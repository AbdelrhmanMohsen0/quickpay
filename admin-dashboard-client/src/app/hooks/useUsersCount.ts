import { useEffect, useState } from "react";
import { getUsersCount } from "@/services/userService";

export const useUsersCount = () => {

    const [usersCount, setUsersCount]     = useState<number>();
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const data = await getUsersCount();
            setUsersCount(data)
          } catch (err: any) {
            setError(err.response?.data?.message ?? "Failed to fetch user");
          } finally {
            setLoading(false);
          }
        };
    
        fetchUsers();
      }, []);
    
      return { usersCount, loading, error };
};