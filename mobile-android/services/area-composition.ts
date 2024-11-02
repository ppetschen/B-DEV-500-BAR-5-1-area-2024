/*
 ** EPITECH PROJECT, 2024
 ** stupidArea
 ** File description:
 ** area-composition
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, TOKEN } from "../asyncStorageLibrary/basicRequestVars";

export interface areaInList {
    name: string;
    services: React.JSX.Element[];
    status: string;
    date: string;
    url: string;
}

export interface responseAreaInList {
    created_at: string;
    event_type: string;
    id: string;
    owner_id: number;
    payload: { content: string };
    service_name: string;
}

export async function getListAreas(): Promise<Array<responseAreaInList> | null> {
    try {
        const baseURL = await AsyncStorage.getItem(API_BASE_URL);
        console.log("TOKEN", await AsyncStorage.getItem(TOKEN));
        console.log("API BASE URL", baseURL);

        const response = await fetch(`${baseURL}/area-composition/list`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await AsyncStorage.getItem(TOKEN)}`,
            },
        });
        console.log(
            "\n************************Response************************\n",
            response
        );
        console.log(
            "\n\n********************************************************\n\n"
        );

        if (!response.ok) {
            console.log("Response:", await response.text());
            throw new Error(`LIST HTTP error! Status: ${response.status}`);
        }

        const data: Array<responseAreaInList> = await response.json();
        console.log("Data:", data);

        return data;
    } catch (error) {
        console.error("Failed to get list of areas:", error);
        return [];
    }
}
