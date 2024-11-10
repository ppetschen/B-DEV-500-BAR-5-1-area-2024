import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const base_url = "https://ladybird-immortal-anteater.ngrok-free.app";

export const apiClient = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthorizationHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  apiClient.defaults.headers.common["Client-Type"] = "mobile";
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};
