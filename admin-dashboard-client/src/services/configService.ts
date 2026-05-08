import api from "@/lib/axios";
import type { SystemConfig } from "@/types/types";

// TODO: replace the path below with the real endpoint
const CONFIG_ENDPOINT = "/transaction/fees/config";

export const getSystemConfig = async (): Promise<SystemConfig> => {
  const { data } = await api.get(CONFIG_ENDPOINT);
  return data;
};

export const updateSystemConfig = async (
  config: SystemConfig
): Promise<SystemConfig> => {
  const { data } = await api.patch(CONFIG_ENDPOINT, config);
  return data;
};
