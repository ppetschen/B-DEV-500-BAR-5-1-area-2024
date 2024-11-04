/*
 ** EPITECH PROJECT, 2024
 ** stupidArea
 ** File description:
 ** service-management
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, TOKEN } from "@/asyncStorageLibrary/basicRequestVars";

export const authenticateToService = async (
    service: string
): Promise<string | null> => {
    const baseUrl =
        (await AsyncStorage.getItem(API_BASE_URL)) || "http://localhost:8000";
    //^ pass REDIRECT URI for the dynamicMobileRedirectUri
    try {
        console.log("Service:", service);
        console.log(
            "ENDPOINT:",
            `${baseUrl}/service-management/auth?service=${service}`
        );
        const response = await fetch(
            `${baseUrl}/service-management/auth?service=${service}`,
            {
                method: "GET",
                headers: {
                    "X-Client-Type": "mobile",
                    "X-Mobile-Redirect-Uri": `${baseUrl}/service-management/auth?service=${service}`,
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        "token"
                    )}`,
                },
            }
        );
        const text = await response.text();
        console.log("Full response from server:", text);
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
