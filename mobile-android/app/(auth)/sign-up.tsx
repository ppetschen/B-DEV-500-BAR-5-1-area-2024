/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** signUp page
 */

import { Text, View } from "react-native";
import { styled } from "nativewind";
import { useState } from "react";
// @ts-ignore
import { useRouter } from "expo-router";

import { TextInput } from "@components/TextInput";
import { BasicButton } from "@components/BasicButton";
import { register } from "@/services/user-management";

import AsyncStorage from '@react-native-async-storage/async-storage';


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

    // const handleSignUp = async () => {
    //     console.log("Signing handleSignUp");
    //     let valid = true;
    //     if (!email) {
    //         setEmailError("Email is required");
    //         valid = false;
    //     } else if (!email.includes("@")) {
    //         setEmailError("Please enter a valid email");
    //         valid = false;
    //     }
    //     if (!password) {
    //         setPasswordError("Password is required");
    //         valid = false;
    //     }
    //     if (password !== confirmPassword) {
    //         setConfirmPasswordError(
    //             "Password confirmation must match password"
    //         );
    //         valid = false;
    //     }
    //     if (valid) {
    //         console.log("Valid\n");

    //         const response = await register({ email, password });
    //         console.log("Response:", response);
    //         console.log("Signing up with:", { email, password });
    //         router.push("/dashboard");
    //     } else {
    //         console.log("Error signing up");
    //     }
    // };

    const handleSignUp = async () => {
        console.log("Signing handleSignUp");
        let valid = true;

        setEmailError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);

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
            console.log("Valid\n");

            const response = await register({ email, password });

            if (response) {
                console.log("Response:", response);
                console.log("Signing up with:", { email, password });
                console.log("TOKEN: ", await AsyncStorage.getItem("token"));

                // Navigate to dashboard if registration is successful
                router.push("/dashboard");
            } else {
                console.log("Error: Registration failed");
            }
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
