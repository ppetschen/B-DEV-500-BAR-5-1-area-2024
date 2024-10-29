/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** login page
 */

import { Text, View } from "react-native";
import { styled } from "nativewind";
import React, { useState } from "react";
import { useRouter } from "expo-router";

import { TextInput } from "@components/TextInput";
import { BasicButton } from "@components/BasicButton";
import { login } from "@/services/user-management";

const StyledView = styled(View);
const StyledText = styled(Text);

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
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
            const response = await login({ email, password });
            if (response) {
                console.log("Response:", response);
                router.push("/dashboard");
            } else {
                console.log("Login failed");
            }
        }
    };
    return (
        <StyledView className="flex-1 justify-center items-center bg-white px-6">
            <StyledText className="text-3xl font-bold text-gray-800 mb-8">
                Login
            </StyledText>

            <TextInput
                value={email}
                placeholder="Email"
                onChangeText={setEmail}
                onChange={() => setEmailError(null)}
                keyboardType="email-address"
                error={emailError}
            />
            <TextInput
                value={password}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                onChange={() => setPasswordError(null)}
                error={passwordError}
            />

            <BasicButton title="Login" onPress={handleLogin} />
        </StyledView>
    );
}
