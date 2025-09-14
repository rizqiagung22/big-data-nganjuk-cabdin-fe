import {http} from "@/core/plugins/axios.plugin.ts";
import {Buffer} from "buffer";
import {saveAs} from "file-saver";


export const getApiBksm = async (params: any) => {
  try {
    return await http.get<any>("/bksm", {
      params: params
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
export const getDownloadFileApiBksm = async (id: any, filename: string) => {
  try {
    const response = await http.get<any>(`/bksm/download/${id}`, {
      responseType: "arraybuffer",
    });
    const data = `data:${
      response.headers["content-type"]
    };base64,${new Buffer(response.data, "binary").toString("base64")}`;
    saveAs(data, filename);
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const deleteFileApiBksm = async (id: any) => {
  try {
    await http.delete<any>(`/bksm/${id}`,);
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};


export const addFileApiBksm = async (formData: FormData) => {
  try {
    await http.post<any>(`/bksm`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const updateFileApiBksm = async (id: any, formData: FormData) => {
  try {
    await http.post<any>(`/bksm/update-file/${id}`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
