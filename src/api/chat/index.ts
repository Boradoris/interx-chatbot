import { handleError } from "@/utils/error";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  config => {
    if (config.headers) {
      config.headers["Authorization"] = `Bearer ${import.meta.env.VITE_CHAT_API_KEY}`;
    }
    return config;
  },
  e => {
    return Promise.reject(e);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  e => {
    if (e.response && e.response.data) {
      return Promise.reject(e);
    }

    return Promise.reject(e);
  }
);

export async function Post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axiosInstance.post<T>(url, data, config);

    return response.data;
  } catch (e) {
    return handleError(e);
  }
}
