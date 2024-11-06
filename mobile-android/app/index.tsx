/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** index - landing page
 */

import { View, SafeAreaView } from "react-native";
import { styled } from "nativewind";
// @ts-ignore - no types for expo-router
import { useRouter } from "expo-router";

import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text, Surface } from "react-native-paper";

import Constants from "expo-constants";

const StyledView = styled(View);

export default function LandingPage() {
    // Store the IP address in AsyncStorage at the start of the app to use in api requests - avoid error with cors
    // Store it directly in the API_BASE_URL key as the full BASe_URL that will be used in the app for api requests
    useEffect(() => {
        const storeIpAddress = async () => {
            try {
                const debuggerHost = Constants.expoConfig?.hostUri;
                if (debuggerHost) {
                    const ipAddress = debuggerHost.split(":")[0]; // Extract the IP address
                    const base_url = `http://${ipAddress}:8000`;
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
        <SafeAreaView
            style={{
                flex: 1,
                padding: 16,
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Text
                variant="headlineMedium"
                style={{
                    paddingBottom: 12,
                    fontWeight: "bold",
                    color: "#5A6ACF",
                }}
            >
                Area!
            </Text>
            <StyledView className="flex-col">
                <Button
                    mode="contained"
                    icon="login"
                    onPress={() => {
                        router.push("/login");
                    }}
                    style={{ marginVertical: 8 }}
                >
                    Login
                </Button>
                <Button
                    mode="contained"
                    icon="account-plus"
                    onPress={() => {
                        router.push("/sign-up");
                    }}
                    style={{ marginVertical: 8 }}
                >
                    Sign up
                </Button>
            </StyledView>
        </SafeAreaView>
    );
}
