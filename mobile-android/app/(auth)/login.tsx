/*
 ** EPITECH PROJECT, 2024
 ** AREA
 ** File description:
 ** login
 */

import React, { useState } from "react";
import { useRouter } from "expo-router";
import { login, oauthUser } from "@/services/user-management";
import { Text, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("area1.epitech@gmail.com");
    const [password, setPassword] = useState<string>("ThisIsAPassword123");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const router = useRouter();

    const handleLogin = async () => {
        let valid = true;
        if (!email) {
            setEmailError("Email is required");
            valid = false;
        } else if (!email.includes("@")) {
            setEmailError("Please enter a valid email");
            valid = false;
        }
        if (!password) {
            setPasswordError("Password is required");
            valid = false;
        }
        if (valid) {
            const response = await login({ email, password }, "credentials");
            // const response = await oauthUser("google");
            if (response) {
                router.push("/dashboard");
            } else {
                console.log("Login failed");
            }
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 24,
            }}
        >
            <Text
                variant="headlineLarge"
                style={{ marginBottom: 16, color: "#5A6ACF" }}
            >
                Login
            </Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setEmailError(null);
                }}
                keyboardType="email-address"
                error={!!emailError}
                style={{ width: "80%", marginBottom: 16 }}
                mode="outlined"
            />
            {emailError && (
                <Text style={{ color: "red", marginBottom: 8 }}>
                    {emailError}
                </Text>
            )}

            <TextInput
                label="Password"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError(null);
                }}
                secureTextEntry={!showPassword}
                error={!!passwordError}
                style={{ width: "80%", marginBottom: 16 }}
                mode="outlined"
                right={
                    <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            {passwordError && (
                <Text style={{ color: "red", marginBottom: 8 }}>
                    {passwordError}
                </Text>
            )}

            <Button
                mode="contained"
                onPress={handleLogin}
                contentStyle={{ height: 50 }}
                labelStyle={{ fontSize: 16 }}
                style={{ width: "80%", marginTop: 16 }}
            >
                Login
            </Button>
            <Button
                mode="contained"
                onPress={async () => {
                    //TODO: Implement Google login
                    console.log("Google login pressed");
                }}
                contentStyle={{ height: 50 }}
                labelStyle={{ fontSize: 16 }}
                style={{
                    width: "80%",
                    marginTop: 16,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                icon={() => (
                    <IconFontAwesome name="google" size={32} color="#fff" />
                )}
            >
                Login with Google
            </Button>
        </SafeAreaView>
    );
}
