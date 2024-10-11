/*
** EPITECH PROJECT, 2024
** mobile
** File description:
** home
*/

import { Text, View } from "react-native";
import { styled } from "nativewind";
import { Link } from "expo-router";

const StyledText = styled(Text);
const StyledView = styled(View);

export default function WorkflowsDashboard() {
    return (
        <StyledView className="flex-1 justify-center items-center bg-white px-6">
            <StyledText className="text-3xl">Area workflows</StyledText>
        </StyledView>
    );
}
