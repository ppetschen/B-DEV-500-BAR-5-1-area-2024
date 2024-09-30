/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** TextInput component
 */


import React from "react";
import { TextInput as RNTextInput, TextInputProps } from "react-native";
import { styled } from "nativewind";

const StyledTextInput = styled(RNTextInput);

interface Props extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
}

export const TextInput: React.FC<Props> = ({
    value,
    onChangeText,
    placeholder,
    ...props
}) => {
    return (
        <StyledTextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            className="w-80 h-12 px-4 mb-4 border border-gray-300 rounded-lg"
            {...props}
        />
    );
};
