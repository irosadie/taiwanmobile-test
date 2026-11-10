import axios from "axios";
export const axiosInstance = axios.create({ baseURL: "/api/proxy", timeout: 15000, headers: { "Content-Type": "application/json" } });
axiosInstance.interceptors.response.use(response => {
  if (response.data && typeof response.data === "object" && "data" in response.data) response.data = response.data.data;
  return response;
});
