import {http} from "@/core/plugins/axios.plugin.ts";
import {Buffer} from "buffer";
import {saveAs} from "file-saver";


export const getApiTracerStudy = async (params: any) => {
  try {
    return await http.get<any>("/tracer-study", {
      params: params
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
export const getDownloadFileApiTracerStudy = async (id: any, filename: string) => {
  try {
    const response = await http.get<any>(`/tracer-study/download/${id}`, {
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

export const deleteFileApiTracerStudy = async (id: any) => {
  try {
    await http.delete<any>(`/tracer-study/${id}`,);
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};


export const addFileApiTracerStudy = async (formData: FormData) => {
  try {
    await http.post<any>(`/tracer-study`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const updateFileApiTracerStudy = async (id: any, formData: FormData) => {
  try {
    await http.post<any>(`/tracer-study/update-file/${id}`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
