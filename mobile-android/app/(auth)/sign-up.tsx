/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** signUp page
 */

import { SafeAreaView } from "react-native";
import { useState } from "react";
// @ts-ignore
import { useRouter } from "expo-router";

import { register } from "@/services/user-management";
import { Text, Button, TextInput } from "react-native-paper";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";

export default function SignUpPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<
        string | null
    >(null);

    const router = useRouter();
    const handleSignUp = async () => {
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
            const response = await register({ email, password }, "credentials");

            if (response) {
                router.push("/dashboard");
            } else {
                console.log("Error: Registration failed");
            }
        } else {
            console.log("Error signing up");
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
                Sign Up
            </Text>
            <TextInput
                label="Email"
                mode="outlined"
                style={{ width: "80%", marginBottom: 16 }}
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setEmailError(null);
                }}
                keyboardType="email-address"
                error={!!emailError}
            />
            {emailError && (
                <Text style={{ color: "red", marginBottom: 8 }}>
                    {emailError}
                </Text>
            )}
            <TextInput
                label="Password"
                mode="outlined"
                style={{ width: "80%", marginBottom: 16 }}
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError(null);
                }}
                error={!!passwordError}
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
            <TextInput
                label="Confirm Password"
                mode="outlined"
                style={{ width: "80%", marginBottom: 16 }}
                value={confirmPassword}
                secureTextEntry={!showConfirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    setConfirmPasswordError(null);
                }}
                error={!!confirmPasswordError}
                right={
                    <TextInput.Icon
                        icon={showConfirmPassword ? "eye-off" : "eye"}
                        onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    />
                }
            />
            {confirmPasswordError && (
                <Text style={{ color: "red", marginBottom: 8 }}>
                    {confirmPasswordError}
                </Text>
            )}
            <Button
                mode="contained"
                onPress={handleSignUp}
                contentStyle={{ height: 50 }}
                labelStyle={{ fontSize: 16 }}
                style={{ width: "80%", marginTop: 16 }}
            >
                Sign Up
            </Button>
            <Button
                mode="contained"
                onPress={async () => {
                    //TODO: Implement Google Sign Up
                    console.log("Google Sign Up pressed");
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
                Sign up with Google
            </Button>
        </SafeAreaView>
    );
}
