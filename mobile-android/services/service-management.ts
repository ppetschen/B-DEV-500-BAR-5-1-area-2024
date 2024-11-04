/*
** EPITECH PROJECT, 2024
** stupidArea
** File description:
** service-management
*/

import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_BASE_URL, TOKEN} from "@/asyncStorageLibrary/basicRequestVars";
import * as WebBrowser from "expo-web-browser";

export const authenticateToService = async (service: string): Promise<string | null> => {
    const baseUrl: string = "https://certainly-regular-buzzard.ngrok-free.app"; //await AsyncStorage.getItem(API_BASE_URL) || "http://localhost:8000";
    try {
        // const redirectUri = AuthSession.makeRedirectUri();

        const response = await fetch(`${baseUrl}/service-management/auth?service=${service}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await AsyncStorage.getItem(TOKEN)}`,
            },
        });
        console.log("*************************************Response:**********************************\n********************************************************************\n", response)
        let result = await WebBrowser.openBrowserAsync(response.url);



        if (!response.ok) {
            // console.log("Response:", response);
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
