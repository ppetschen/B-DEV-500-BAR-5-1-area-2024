/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** index - landing page
 */

import { Text, View } from "react-native";
import { styled } from "nativewind";
// @ts-ignore - no types for expo-router
import { useRouter } from "expo-router";

import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BasicButtonWithIcon } from "../components/Button";

import Constants from 'expo-constants'

const StyledText = styled(Text);
const StyledView = styled(View);

//* The key for getting/setting the base URL from/to AsyncStorage
const API_BASE_URL = "api_base_url";

export default function LandingPage() {
    // Store the IP address in AsyncStorage at the start of the app to use in api requests - avoid error with cors
    // Store it directly in the API_BASE_URL key as the full BASe_URL that will be used in the app for api requests
    useEffect(() => {
        const storeIpAddress = async () => {
            try {
                const debuggerHost = Constants.expoConfig?.hostUri;
                if (debuggerHost) {
                    const ipAddress = debuggerHost.split(':')[0]; // Extract the IP address
                    const base_url = `http://${ipAddress}:8000`;
                    await AsyncStorage.setItem(API_BASE_URL, base_url);
                    console.log("BASE_URL:", await AsyncStorage.getItem(API_BASE_URL));
                } else {
                    console.error("No hostUri found in expoConfig.");
                }
            } catch (error) {
                console.error("Failed to get or store IP address:", error);
            }
        };

        storeIpAddress();
    }, []);

    const router = useRouter();
    return (
        <StyledView className="flex-1 justify-center items-center bg-white px-6">
            <StyledText className="text-3xl pb-3">Area!</StyledText>
            <StyledView className="flex-col">
                <BasicButtonWithIcon
                    title="Login"
                    onPress={() => {
                        router.push("/login");
                    }}
                    iconName="login"
                />
                <BasicButtonWithIcon
                    title="Sign up"
                    onPress={() => {
                        router.push("/sign-up");
                    }}
                    iconName="group-add"
                />
            </StyledView>
        </StyledView>
    );
}
