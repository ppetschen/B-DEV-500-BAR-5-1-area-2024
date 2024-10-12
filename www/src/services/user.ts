import { apiClient } from "./api";

export const login = async (user: { email: string; password: string }) => {
  const response = await apiClient.post("/user-management/login", user);
  if (!response || !response.data || !response.data.token) {
    return undefined;
  } else {
    localStorage.setItem("token", response.data.token);
    return response.data;
  }
};

export const register = async (user: { email: string; password: string }) => {
  const response = await apiClient.post("/user-management/register", user);
  if (!response || !response.data || !response.data.token) {
    return undefined;
  } else {
    localStorage.setItem("token", response.data.token);
    return response.data;
  }
};
