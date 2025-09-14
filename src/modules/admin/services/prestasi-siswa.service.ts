import {http} from "@/core/plugins/axios.plugin.ts";
import {Buffer} from "buffer";
import {saveAs} from "file-saver";


export const getApiPrestasiSiswa = async (params: any) => {
  try {
    return await http.get<any>("/prestasi-siswa", {
      params: params
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
export const getDownloadFileApiPrestasiSiswa = async (id: any, filename: string) => {
  try {
    const response = await http.get<any>(`/prestasi-siswa/download/${id}`, {
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

export const deleteFileApiPrestasiSiswa = async (id: any) => {
  try {
    await http.delete<any>(`/prestasi-siswa/${id}`,);
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};


export const addFileApiPrestasiSiswa = async (formData: FormData) => {
  try {
    await http.post<any>(`/prestasi-siswa`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const updateFileApiPrestasiSiswa = async (id: any, formData: FormData) => {
  try {
    await http.post<any>(`/prestasi-siswa/update-file/${id}`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};
