import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5001",
  // baseURL: "http://16.176.225.29", // old public IP, not working
  baseURL: "http://13.211.112.82",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosInstance;
