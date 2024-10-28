/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** TextInput component
 */

import React from "react";
import { View, TextInput as RNTextInput, TextInputProps } from "react-native";
import { styled } from "nativewind";

import ErrorMessage from "./ErrorMessage";

const StyledTextInput = styled(RNTextInput);
const StyledView = styled(View);

interface Props extends TextInputProps {
    error?: string | null;
}

export const TextInput: React.FC<Props> = ({ error, ...props }) => {
    return (
        <StyledView>
            {error && <ErrorMessage message={error} />}

            <StyledTextInput
                value={props.value}
                placeholder={props.placeholder}
                placeholderTextColor={"#B6BEC7"}
                className={`w-80 h-12 px-4 mb-4 rounded-lg border bg-inputBox ${
                    error ? "border-error" : "border-gray-300"
                }`}
                {...props}
            />
        </StyledView>
    );
};
