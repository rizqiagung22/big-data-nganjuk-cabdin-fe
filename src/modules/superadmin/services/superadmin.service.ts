import {http} from "@/core/plugins/axios.plugin.ts";

export const postApiTahun = async (params: any) => {
  try {
    return await http.post<any>("/tahun", params);
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};


export const updateApiTahun = async (params: any, id : string) => {
  try {
    return await http.put<any>(`/tahun/${id}`, params);
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const deleteApiTahun = async (id : string) => {
  try {
    return await http.delete<any>(`/tahun/${id}`);
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
