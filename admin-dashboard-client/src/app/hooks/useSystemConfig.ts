import { useEffect, useState } from "react";
import type { SystemConfig } from "@/types/types";
import { getSystemConfig, updateSystemConfig } from "@/services/configService";

export const useSystemConfig = () => {
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getSystemConfig();
        setConfig(data);
      } catch (err: any) {
        setError(err.response?.data?.message ?? "Failed to fetch configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const saveConfig = async (updated: SystemConfig) => {
    setSaving(true);
    setError(null);
    try {
      const data = await updateSystemConfig(updated);
      setConfig(data);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to save configuration");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { config, loading, saving, error, saveConfig };
};
