import { useAuth } from "@clerk/clerk-react";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean; // Extend Axios request config with custom property
}
interface ErrorResponse {
  message: string;
  // other properties
}

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();

  useEffect(() => {
    const fullfilledInterceptor = (response: AxiosResponse) => {
      console.log({ INTERCEPTOR_RES: response });
      return response;
    };

    const errorInterceptor = async (error: AxiosError) => {
      const originalRequest = error.config as ExtendedAxiosRequestConfig;
      console.log({ AXIOS_ERROR: error });
      // If the error is due to an expired token
      if (
        originalRequest &&
        error.response?.status === 403 &&
        (error.response?.data as ErrorResponse)?.message === "jwt expired" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const newToken = await getToken(); // Refresh token
          //   Update the token for every request
          axiosInstance.defaults.headers.common["Authorization"] = newToken;

          // Ensure originalRequest.headers is defined before accessing it
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }

          // Update the Authorization header with the new token for the original request config
          originalRequest.headers["Authorization"] = newToken;

          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Handle error while refreshing token
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    };

    const interceptor = axiosInstance.interceptors.response.use(
      fullfilledInterceptor,
      errorInterceptor
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [getToken]);

  return <>{children}</>;
};

export default AxiosInterceptor;
