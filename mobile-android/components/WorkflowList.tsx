/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** WorkflowList
 */

import React, { useState } from "react";
import { View, FlatList, Text, Switch, Alert } from "react-native";
import { styled } from "nativewind";
import { BasicButton } from "./BasicButton";
// import { WorkflowInList } from "@components/WorkflowInList";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSwitch = styled(Switch);
const StyledFlatList = styled(FlatList);

//TODO: add extra data to the workflow list whe connect to backend

interface WorkflowInListProps {
    id: string; // temporarily no id needed
    name: string;
    description?: string;
    connection?: { from: string; to: string };
    lastRun?: string;
    createdAt?: string;
}

/**
 *  Component - Button with title
 */
export const WorkflowInList: React.FC<WorkflowInListProps> = ({ ...props }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    const deleteAutomation = () => {
        Alert.alert(
            "Delete Connection",
            "Are you sure you want to delete this connection?",
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        console.log(
                            `Canceled deletion of automation with ID ${props.id}.`
                        );
                    },
                },
                {
                    text: "Delete",
                    onPress: () => {
                        console.log(
                            `(PENDING TO CONNECT BACK) Deleted automation with ID ${props.id}.`
                        );
                    },
                },
            ]
        );
    };
    return (
        <StyledView className="w-full h-12 flex-row items-center bg-slate-500 rounded justify-between my-1">
            <StyledText className="flex ml-4 min-w-fit text-neutral-950">
                {props.name}
            </StyledText>
            <BasicButton title="Delete" onPress={() => deleteAutomation()}>
            </BasicButton>
            <StyledSwitch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isEnabled}
                className="flex mr-3"
            />
        </StyledView>
    );
};

interface WorkflowListProps {
    workflows: WorkflowInListProps[];
}

export const WorkflowList: React.FC<WorkflowListProps> = ({ workflows }) => {
    return (
        <StyledView className="flex-1 bg-white p-4">
            <FlatList
                data={workflows}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <WorkflowInList {...item} />}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </StyledView>
    );
};
