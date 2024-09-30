/*
** EPITECH PROJECT, 2024
** mobile
** File description:
** ErrorMessage component for messages shown to the user
*/


// ErrorMessage.tsx
import React from "react";
import { styled } from "nativewind";
import { View, Text } from "react-native";

const ErrorBox = styled(View);
const ErrorText = styled(Text);

interface Props {
    message: string;
}

export const ErrorMessage: React.FC<Props> = ({ message }) => {
    return (
        <ErrorBox className="flex p-1 rounded ">
            <ErrorText className="text-red-600">{message}</ErrorText>
        </ErrorBox>
    );
};

export default ErrorMessage;
