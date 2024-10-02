/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** ErrorMessage component for messages shown to the user
 */

// ErrorMessage.tsx
import React from "react";
import { styled } from "nativewind";
import { Text } from "react-native";

const ErrorText = styled(Text);

interface Props {
    message: string;
}

export const ErrorMessage: React.FC<Props> = ({ message }) => {
    return <ErrorText className="text-error">{message}</ErrorText>;
};

export default ErrorMessage;
