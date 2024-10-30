import { apiClient } from "./api";

export const login = async (data: { email: string; password: string}, method: string) => {
  const response = await apiClient.post(`/user-management/login?method=${method}`, data);
  if (!response || !response.data || !response.data.token) {
    return undefined;
  } else {
    localStorage.setItem("token", response.data.token);
    return response.data;
  }
};

export const register = async (data: { email: string; password: string }, method: string) => {
  const response = await apiClient.post(`/user-management/register?method=${method}`, data);
  if (!response || !response.data || !response.data.token) {
    return undefined;
  } else {
    localStorage.setItem("token", response.data.token);
    return response.data;
  }
};
