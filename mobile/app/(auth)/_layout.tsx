/*
 ** EPITECH PROJECT, 2024
 ** mobile/(auth)/_layout.tsx
 ** File description:
 ** _layout for auth
 */

import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="login" />
            <Stack.Screen name="sign-up" />
        </Stack>
    );
}
