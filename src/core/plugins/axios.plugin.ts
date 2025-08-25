import axios, { AxiosError } from "axios";
import {useErrorStore} from "../stores/error.store.js";
import {useAuthStore} from "../stores/auth.store.js";

const http = axios.create({ baseURL: import.meta.env.VITE_MODE === 'stg' ? import.meta.env.VITE_API_URL_STG : import.meta.env.VITE_API_URL_DEV});

http.interceptors.request.use((config) => {
  const store = useAuthStore();
  const token = store.authToken;
  console.log(token, "token")
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["ngrok-skip-browser-warning"] = `true`;
  }
  return config;
});

http.interceptors.response.use(undefined, (err: AxiosError) => {
  // const errFromBackend = getErrorMessage(err);
  if (err.response) {
    // const errMessage = `ZIPKIN TRACE ID: ${err.response.headers["X-B3-TraceId"]}` ?? errFromBackend;
    const errMessage = `ZIPKIN TRACE ID: ${err.response.headers["X-B3-TraceId"]}`;
    const store = useErrorStore();
    store.setError({
      title: "Server error",
      message: errMessage,
    });
  }

  throw err;
});

export { http };
