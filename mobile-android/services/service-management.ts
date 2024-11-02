/*
** EPITECH PROJECT, 2024
** stupidArea
** File description:
** service-management
*/

import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_BASE_URL} from "@/asyncStorageLibrary/basicRequestVars";

export const authenticateToService = async (service: string): Promise<string | null> => {
    const baseUrl = await AsyncStorage.getItem(API_BASE_URL) || "http://localhost:8000";
    try {
        const response = await fetch(`${baseUrl}/service-management/auth?service=${service}`, {
            method: "GET",
        });
        if (!response.ok) {
            console.log("Response:", response);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("##########################################Data:\n", data);
        return data;
    } catch (error) {
        console.error(`Failed to authenticate with ${service}:`, error);
        return null;
    }
};
