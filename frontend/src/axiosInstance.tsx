import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const API = axios.create({
  baseURL: BASE_URL,
  // baseURL: "http://localhost:4000/api/",
  withCredentials: true,
});

// // Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.withCredentials = true;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("fetching");
      try {
        const response = await axios.get(`${BASE_URL}auth/refresh`, {
          withCredentials: true,
        });

        const { token } = response.data.data;

        console.log("fetched", token);
        localStorage.setItem("token", token);

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        // Refresh token failed, redirect to login or perform other actions
        console.error("Refresh token failed:", error);
        // You might want to redirect to login page or clear tokens here
      }
    }

    // window.location.href = "/the-console-login";
    return Promise.reject(error);
  }
);

export default API;
