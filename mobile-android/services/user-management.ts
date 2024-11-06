/*
 ** EPITECH PROJECT, 2024
 ** safeArea
 ** File description:
 ** user-management
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient, setAuthorizationHeader } from "./api";
import { User, UserAndServices } from "./types";

// Checked WORKING
export const login = async (
  data: { email: string; password?: string },
  method: string,
): Promise<boolean> => {
  try {
    const response = await apiClient.post<User>(
      `/user-management/login?method=${method}`,
      data,
    );
    AsyncStorage.setItem("token", response.data.token);
    return true;
  } catch (error) {
    console.log("Failed to login: ", error);
    return false;
  }
};

// Checked WORKING
export const register = async (
  data: { email: string; password?: string },
  method: string,
): Promise<boolean> => {
  try {
    const response = await apiClient.post<User>(
      `/user-management/register?method=${method}`,
      data,
    );
    AsyncStorage.setItem("token", response.data.token);
    return true;
  } catch (error) {
    console.log("Failed to register: ", error);
    return false;
  }
};

// Checked WORKING
export const getUser = async (): Promise<UserAndServices | boolean> => {
  try {
    await setAuthorizationHeader();
    const responseUser = await apiClient.get<User>(`/user-management/get-user`);
    const responseServices = await apiClient.get<string[]>(
      `/service-management/auth/get-services-by-user`,
    );
    const user = {
      ...responseUser.data,
      services: responseServices.data,
    };
    return user;
  } catch (error) {
    console.log("Failed to get user: ", error);
    return false;
  }
};

// Checked WORKING
export const updateUser = async (
  data: {
    new_password?: string;
    first_name?: string;
    last_name?: string;
    description?: string;
  },
): Promise<UserAndServices | boolean> => {
  try {
    await setAuthorizationHeader();
    const responseUser = await apiClient.put<User>(
      `/user-management/update-user`,
      data,
    );
    const responseServices = await apiClient.get<any>(
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

// Checked WORKING
export const deleteUser = async (): Promise<boolean> => {
  try {
    await setAuthorizationHeader();
    const response = await apiClient.delete(`/user-management/delete-user`);
    if (!response) {
      return false;
    }
    AsyncStorage.removeItem("token");
    return true;
  } catch (error) {
    console.log("Failed to delete user: ", error);
    return false;
  }
};

