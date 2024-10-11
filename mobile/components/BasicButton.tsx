/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** Button component
 */

import React from "react";
import { TouchableOpacity, GestureResponderEvent, Text, View } from "react-native";
import { styled } from "nativewind";

const StyledButton = styled(TouchableOpacity);
const StyledText = styled(Text);

interface Props {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
}

/**
 *  Component - Button with title
*/
export const BasicButton: React.FC<Props> = ({ title, onPress }) => {
    return (
        <StyledButton
            onPress={onPress}
            className="w-auto bg-blue-500 text-white p-3 rounded"
            >
            <StyledText className="min-w-fit text-white">{title}</StyledText>
        </StyledButton>
    );
};
