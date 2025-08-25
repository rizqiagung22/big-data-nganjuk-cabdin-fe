import {http} from "@/core/plugins/axios.plugin.ts";


export const getApiBpopp = async (params : any) => {
  try {
    return await http.get<any>("/bpopp", {
      params: params
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
