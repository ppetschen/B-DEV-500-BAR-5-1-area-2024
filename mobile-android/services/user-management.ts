/*
 ** EPITECH PROJECT, 2024
 ** safeArea
 ** File description:
 ** user-management
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN } from "../asyncStorageLibrary/basicRequestVars";

// Define a key for AsyncStorage
// const TOKEN = "token";

// services/api.ts

export interface RegisterAndLoginResponse {
    id: number;
    email: string;
    password_hash: string;
    created_at: string;
    updated_at: string;
    last_login: string | null;
    is_active: boolean;
    token: string;
}

interface RegisterRequest {
    email: string;
    password: string;
    method: "third-party" | "credentials";
}

export async function register({
    email,
    password,
    method,
}: RegisterRequest): Promise<RegisterAndLoginResponse | null> {
    const baseUrl: string = (await AsyncStorage.getItem("api_base_url"))
        ? (await AsyncStorage.getItem("api_base_url")) +
          `/user-management/register?method=${method}`
        : `http://localhost:8000/user-management/register?method=${method}`;
    console.log("BASE_URL:", baseUrl);
    try {
        const response = await fetch(`${baseUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: RegisterAndLoginResponse = await response.json();

        await AsyncStorage.setItem(TOKEN, data.token);
        return data;
    } catch (error) {
        console.error("Failed to register:", error);
        return null;
    }
}

export async function login({
    email,
    password,
    method,
}: RegisterRequest): Promise<RegisterAndLoginResponse | null> {
    const baseUrl: string = (await AsyncStorage.getItem("api_base_url"))
        ? (await AsyncStorage.getItem("api_base_url")) +
          `/user-management/login?method=${method}`
        : `http://localhost:8000/user-management/login?method=${method}`;
    try {
        const response = await fetch(`${baseUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: RegisterAndLoginResponse = await response.json();

        await AsyncStorage.setItem(TOKEN, data.token);
        return data;
    } catch (error) {
        console.error("Failed to login:", error);
        return null;
    }
}
