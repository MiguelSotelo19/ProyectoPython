import axios from "axios";

const baseURL = "http://127.0.0.1:8000";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${baseURL}/users/token/refresh/`, {
          refresh: localStorage.getItem("refreshToken"),
        });

        localStorage.setItem("accessToken", response.data.access);
        
        axiosInstance.defaults.headers["Authorization"] =
          "Bearer " + response.data.access;

        originalRequest.headers["Authorization"] = "Bearer " + response.data.access;

        return axiosInstance(originalRequest); 
      } catch (err) {
        console.error("Error al refrescar token:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
