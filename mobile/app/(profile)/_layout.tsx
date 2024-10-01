/*
** EPITECH PROJECT, 2024
** mobile
** File description:
** _layout
*/

import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen name="profile" options={{ headerShown: false }} />
        </Stack>
    );
}
