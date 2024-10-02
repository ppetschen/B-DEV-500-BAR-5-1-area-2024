/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** signUp page
 */

import { Text, View } from "react-native";
import { styled } from "nativewind";
import React, { useState } from "react";
import { useRouter } from "expo-router";

import { TextInput } from "@components/TextInput";
import { BasicButton } from "@components/BasicButton";

const StyledView = styled(View);
const StyledText = styled(Text);

export default function SignUpPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<
        string | null
    >(null);

    const router = useRouter();

    const handleSignUp = () => {
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
        if (password !== confirmPassword) {
            setConfirmPasswordError(
                "Password confirmation must match password"
            );
            valid = false;
        }
        if (valid) {
            console.log("Signing up with:", { email, password });
            router.push("/workflows-dashboard"); // Replace with your target route after signUp
            // Perform signUp logic here (e.g., API request)
            // setError(null);
        } else {
            console.log("Error signing up");
        }
    };

    return (
        <StyledView className="flex-1 justify-center items-center bg-white px-6">
            <StyledText className="flex-2 text-3xl font-bold text-gray-800 mb-8">
                Sign Up
            </StyledText>

            <StyledView className="flex-2">
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
                <TextInput
                    textContentType="password"
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    secureTextEntry
                    onChangeText={setConfirmPassword}
                    onChange={() => setConfirmPasswordError(null)}
                    error={confirmPasswordError}
                />
            </StyledView>

            <BasicButton title="Sign Up" onPress={handleSignUp} />
        </StyledView>
    );
}
