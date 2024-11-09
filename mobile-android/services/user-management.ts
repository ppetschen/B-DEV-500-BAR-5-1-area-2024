/*
 ** EPITECH PROJECT, 2024
 ** Area
 ** File description:
 ** user-management
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient, setAuthorizationHeader } from "./api";
import { User, UserAndServices } from "./types";
import { PASSWORD, TOKEN } from "@/asyncStorageLibrary/basicRequestVars";

// Checked WORKING
export const login = async (
    data: { email: string; password?: string },
    method: string
): Promise<boolean> => {
    try {
        const response = await apiClient.post<User>(
            `/user-management/login?method=${method}`,
            data
        );
        AsyncStorage.setItem(TOKEN, response.data.token);
        AsyncStorage.setItem(PASSWORD, data.password || "");
        console.log("PASSWORD: ", data.password || "HELLO WORLD");
        return true;
    } catch (error) {
        console.log("Failed to login: ", error);
        return false;
    }
};

// Checked WORKING
export const register = async (
    data: { email: string; password?: string },
    method: string
): Promise<boolean> => {
    try {
        const response = await apiClient.post<User>(
            `/user-management/register?method=${method}`,
            data
        );
        AsyncStorage.setItem("token", response.data.token);
        AsyncStorage.setItem(PASSWORD, data.password || "");
        return true;
    } catch (error) {
        console.log("Failed to register: ", error);
        return false;
    }
};

// Checked WORKING
export const getUser = async (): Promise<User | null> => {
    try {
        await setAuthorizationHeader();
        const response = await apiClient.get<User>(
            `/user-management/get-user`
        );
        // status 200 is OK
        if (response.status != 200) {
            throw new Error(`LIST HTTP error! Status: ${response.status}`);
        }
        console.log("USER: ", response.data);
        return response.data;
    } catch (error) {
        console.log("Failed to get user: ", error);
        return null;
    }
};

export const updateUser = async (data: {
    new_password?: string;
    first_name?: string;
    last_name?: string;
    description?: string;
}): Promise<boolean> => {
    try {
        await setAuthorizationHeader();
        const response = await apiClient.put<User>(
            `/user-management/update-user`,
            data
        );
        return response.status === 200;
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
