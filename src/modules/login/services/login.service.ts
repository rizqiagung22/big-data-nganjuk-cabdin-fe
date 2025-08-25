import {http} from "@/core/plugins/axios.plugin.ts";


export const loginService = async (params: any) => {
    try {
        return await http.post<any>("/login", params);
    } catch (error: any) {
        console.error("Error caught in catch:", error);
        throw error.response;
    }
};
export const userLoginService = async () => {
    try {
        return await http.get<any>("/user");
    } catch (error: any) {
        console.error("Error caught in catch:", error);
        throw error.response;
    }
};
