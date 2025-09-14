import {http} from "@/core/plugins/axios.plugin.ts";
import {Buffer} from "buffer";
import {saveAs} from "file-saver";


export const getApiBsm = async (params: any) => {
  try {
    return await http.get<any>("/bsm", {
      params: params
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
export const getDownloadFileApiBsm = async (id: any, filename: string) => {
  try {
    const response = await http.get<any>(`/bsm/download/${id}`, {
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

export const deleteFileApiBsm = async (id: any) => {
  try {
    await http.delete<any>(`/bsm/${id}`,);
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};


export const addFileApiBsm = async (formData: FormData) => {
  try {
    await http.post<any>(`/bsm`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const updateFileApiBsm = async (id: any, formData: FormData) => {
  try {
    await http.post<any>(`/bsm/update-file/${id}`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
