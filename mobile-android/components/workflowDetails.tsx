/*
 ** EPITECH PROJECT, 2024
 ** Area
 ** File description:
 ** workflow-details
 */

import React from "react";
import { TextInput } from "react-native-paper";
import { styled } from "nativewind";
import { View } from "react-native";

const StyledView = styled(View);

interface WorkflowDetailsProps {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
}

export const WorkflowDetails: React.FC<WorkflowDetailsProps> = ({
    name,
    setName,
    description,
    setDescription,
}) => {
    return (
        <StyledView>
            <TextInput
                label="Workflow Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
            />

            <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                multiline
                numberOfLines={3}
            />
        </StyledView>
    );
};
