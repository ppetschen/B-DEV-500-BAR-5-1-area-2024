/*
** EPITECH PROJECT, 2024
** stupidArea
** File description:
** login
*/

import React, { useState } from "react";
import { useRouter } from "expo-router";
import { login } from "@/services/user-management";
import { Text, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
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
            console.log("Logging in with:", { email, password });
            const response = await login({
                email,
                password,
                method: "credentials",
            });
            if (response) {
                console.log("Response:", response);
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
            <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
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
        </SafeAreaView>
    );
}
