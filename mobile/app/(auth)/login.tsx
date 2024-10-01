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
import { Button } from "@components/Button";
import { ErrorMessage } from "@components/ErrorMessage";

const StyledView = styled(View);
const StyledText = styled(Text);

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        // Perform login logic here (e.g., API request)
        // setError(null);
        console.log("Logging in with:", { email, password });
        router.push("/workflows-dashboard")

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
                keyboardType="email-address"
            />
            <TextInput
                value={password}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
            />

            {error && <ErrorMessage message={error} />}

            <Button title="Login" onPress={handleLogin} />
        </StyledView>
    );
}
