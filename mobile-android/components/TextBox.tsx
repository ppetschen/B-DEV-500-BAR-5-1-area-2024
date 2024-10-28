/*
 ** EPITECH PROJECT, 2024
 ** Area
 ** File description:
 ** TextBox
 */

// w-80 h-12 px-4 mb-4 rounded-lg border bg-inputBox

import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

interface Props {
    text: string;
}

export const TextBox: React.FC<Props> = ({ text }) => {
    return (
        <StyledText className="w-80 h-12 px-4 mb-4 rounded-lg border bg-inputBox border-gray-300 text-align-middle">
            {text}
        </StyledText>
    );
};
