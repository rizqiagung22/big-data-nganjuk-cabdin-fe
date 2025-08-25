import {http} from "@/core/plugins/axios.plugin.ts";

export const getApiTahun = async () => {
  try {
    return await http.get<any>("/tahun");
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
