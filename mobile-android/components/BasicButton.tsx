/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** Button component
 */

import React from "react";
import { TouchableOpacity, GestureResponderEvent, Text } from "react-native";
import { styled } from "nativewind";

const StyledButton = styled(TouchableOpacity);
const StyledText = styled(Text);

interface Props {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    bgTailwind?: string;
}

/**
 *  Component - Button with title
 */
export const BasicButton: React.FC<Props> = ({ ...props }) => {
    return (
        <StyledButton
            onPress={props.onPress}
            className={`w-auto p-3 rounded text-white font-poppins ${
                props.bgTailwind ? props.bgTailwind : "bg-button-basic"
            }`}
        >
            <StyledText className="min-w-fit text-notBlack font-bold ">
                {props.title}
            </StyledText>
        </StyledButton>
    );
};
