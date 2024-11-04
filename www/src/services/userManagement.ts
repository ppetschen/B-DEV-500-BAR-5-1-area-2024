import { apiClient } from "./api";
import { User } from "./types";

export const oauthUser = async (
  service: string,
) => {
  try {
    const response = await apiClient.get(
      `/user-management/auth?service=${service}`,
    );
    if (!response) {
      return;
    }
    window.location.href = response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (
  data: { email: string; password?: string },
  method: string,
): Promise<boolean> => {
  try {
    const response = await apiClient.post(
      `/user-management/login?method=${method}`,
      data,
    );
    localStorage.setItem("token", response.data.token);
    return true;
  } catch (error) {
    console.log("Failed to login: ", error);
    return false;
  }
};

export const register = async (
  data: { email: string; password?: string },
  method: string,
): Promise<boolean> => {
  try {
    const response = await apiClient.post(
      `/user-management/register?method=${method}`,
      data,
    );
    localStorage.setItem("token", response.data.token);
    return true;
  } catch (error) {
    console.log("Failed to register: ", error);
    return false;
  }
};

export const getUser = async (): Promise<User | boolean> => {
  try {
    const responseUser = await apiClient.get(`/user-management/get-user`);
    const responseServices = await apiClient.get(
      `/service-management/auth/get-services-by-user`,
    );
    const user = {
      ...responseUser.data,
      ...responseServices.data,
    };
    return user;
  } catch (error) {
    console.log("Failed to get user: ", error);
    return false;
  }
};

export const updateUser = async (
  data: {
    new_password?: string;
    first_name?: string;
    last_name?: string;
    description?: string;
  },
): Promise<User | boolean> => {
  try {
    const responseUser = await apiClient.put(
      `/user-management/update-user`,
      data,
    );
    const responseServices = await apiClient.get(
      `/service-management/auth/get-services-by-user`,
    );
    const user = {
      ...responseUser.data,
      ...responseServices.data,
    };
    return user;
  } catch (error) {
    console.log("Failed to update user: ", error);
    return false;
  }
};

export const deleteUser = async (): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/user-management/delete-user`);
    if (!response) {
      return false;
    }
    localStorage.removeItem("token");
    return true;
  } catch (error) {
    console.log("Failed to delete user: ", error);
    return false;
  }
};
