import React, { useState } from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import ErrorMessage from "./ErrorMessage";
import { TextInput } from "./TextInput";
import { Button } from "./Button";

const StyledView = styled(View);
const StyledText = styled(Text);

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        // Perform login logic here (e.g., API request)
        setError(null);
        console.log("Logging in with:", { email, password });
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
};

export default LoginScreen;
