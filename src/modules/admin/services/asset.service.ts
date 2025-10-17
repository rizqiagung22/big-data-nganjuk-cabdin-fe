import {http} from "@/core/plugins/axios.plugin.ts";
import {Buffer} from "buffer";
import {saveAs} from "file-saver";


export const getApiAsset = async (params: any) => {
  try {
    return await http.get<any>("/asset", {
      params: params
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};


export const getDownloadFileApiAsset = async (item: any, type: string) => {
  try {
    const response = await http.get<any>(`/asset/download/${item.id}`, {
      params: {
        type : type
      },
      responseType: "arraybuffer",
    });
    const data = `data:${
      response.headers["content-type"]
    };base64,${new Buffer(response.data, "binary").toString("base64")}`;
    if(type == "bos"){
      saveAs(data, item.bos_name_file);
    }
    else if(type == "bpopp"){
      saveAs(data, item.bpopp_name_file);
    }
    else if(type == "bp"){
      saveAs(data, item.bp_name_file);
    }
    else if(type == "pm"){
      saveAs(data, item.pm_name_file);
    }
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const deleteFileApiAsset = async (id: any, type: string) => {
  try {
    await http.delete<any>(`/asset/${id}`,{
      params: {
        type : type
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const updateFileApiAsset = async (id: any, formData: FormData) => {
  try {
    await http.post<any>(`/asset/update-file/${id}`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const getDownloadFileApiAssetSertifikatAndScan = async (item: any, type: string) => {
  try {
    const response = await http.get<any>(`/asset/sertifikat-and-scan/download/${item.id}`, {
      params: {
        type : type
      },
      responseType: "arraybuffer",
    });
    const data = `data:${
      response.headers["content-type"]
    };base64,${new Buffer(response.data, "binary").toString("base64")}`;
    if(type == "scan" && item.scan_name_file != null){
      saveAs(data, item.scan_name_file);
    }
    else if(type == "sertifikat" && item.sertifikat_name_file != null){
      saveAs(data, item.sertifikat_name_file);
    }
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const deleteFileApiAssetSertifikatAndScan = async (id: any, type: string) => {
  try {
    await http.delete<any>(`/asset/sertifikat-and-scan/${id}`,{
      params: {
        type : type
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

export const updateFileApiAssetSertifikatAndScan = async (id: any, formData: FormData) => {
  try {
    await http.post<any>(`/asset/update-file/sertifikat-and-scan/${id}`,formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  } catch (error: any) {
    console.error("Error caught in catch:", error);
    throw error.response;
  }
};

