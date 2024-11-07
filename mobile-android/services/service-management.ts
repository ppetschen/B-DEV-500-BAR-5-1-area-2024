/*
 ** EPITECH PROJECT, 2024
 ** stupidArea
 ** File description:
 ** service-management
 */
import * as WebBrowser from "expo-web-browser";
import { apiClient, setAuthorizationHeader } from "./api";

export const authenticateToService = async (
  service: string,
): Promise<boolean> => {
  try {
    await setAuthorizationHeader();
    const response = await apiClient.get(
      `/service-management/auth?service=${service}`,
    );
    if (response.status != 200) {
      throw new Error(`Failed to authenticate with ${service}`);
    }
    if (typeof response.data != "string") {
      throw new Error(`Expected a string, got ${typeof response.data}`);
    }
    const url = response.data;
    const { type } = await WebBrowser.openBrowserAsync(url);
    return type === "opened";
  } catch (error) {
    console.error(`Failed to authenticate with ${service}:`, error);
    return false;
  }
};

export const isUserSubscribedToService = async (service: string) => {
  try {
    await setAuthorizationHeader();
    const response = await apiClient.post(
      `/service-management/auth/is_user_subscribed`,
      { service },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to check if user is subscribed to ${service}: ${error}`,
    );
  }
};

export const getServicesConnectedInUser = async (): Promise<Array<string> | null> => {
  try {
    await setAuthorizationHeader();
    const response = await apiClient.get<string[]>(
      `/service-management/auth/get-services-by-user`,
    );
    if (response.status != 200) {
      throw new Error(`LIST HTTP error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get services connected to the user: ${error}`);
  }
};
