import {http} from "@/core/plugins/axios.plugin.ts";
import {Buffer} from "buffer";
import {saveAs} from "file-saver";


export const getApiPendistribusianIjazah = async (params: any) => {
  try {
    return await http.get<any>("/pendistribusian-ijazah", {
      params: params
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
export const getDownloadFileApiPendistribusianIjazah = async (id: any, filename: string) => {
  try {
    const response = await http.get<any>(`/pendistribusian-ijazah/download/${id}`, {
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

export const deleteFileApiPendistribusianIjazah = async (id: any) => {
  try {
    await http.delete<any>(`/pendistribusian-ijazah/${id}`,);
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};


export const addFileApiPendistribusianIjazah = async (formData: FormData) => {
  try {
    await http.post<any>(`/pendistribusian-ijazah`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const updateFileApiPendistribusianIjazah = async (id: any, formData: FormData) => {
  try {
    await http.post<any>(`/pendistribusian-ijazah/update-file/${id}`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
