/*
 ** EPITECH PROJECT, 2024
 ** Area
 ** File description:
 ** new-workflow
 */

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
    TextInput,
    Button,
    Appbar,
    Snackbar,
    SegmentedButtons,
} from "react-native-paper";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { FlatList } from "react-native";
import { WorkflowDetails } from "@components/workflowDetails";

// Mock data for apps and actions
const mockApps = [
    {
        id: "1",
        name: "GitHub",
        actions: ["Create Issue", "Push Commit", "Create Pull Request"],
    },
    {
        id: "2",
        name: "Slack",
        actions: ["Send Message", "Create Channel", "Archive Channel"],
    },
    {
        id: "3",
        name: "Google Drive",
        actions: ["Upload File", "Create Folder", "Share Document"],
    },
    {
        id: "4",
        name: "Twitter",
        actions: ["Post Tweet", "Follow User", "Like Tweet"],
    },
];

const StyledView = styled(View);

export default function WorkflowCreationPage() {
    const navigation = useNavigation();
    const [value, setValue] = useState<"details" | "actions" | "reactions">(
        "details"
    );
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [detailsSnackbarVisible, setDetailsSnackbarVisible] =
        useState<boolean>(false);

    // State for DropDownPicker
    const [openApp, setOpenApp] = useState(false);
    const [selectedApp, setSelectedApp] = useState<string | null>(null);
    const [openAction, setOpenAction] = useState(false);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const [appItems, setAppItems] = useState(
        mockApps.map((app) => ({ label: app.name, value: app.id }))
    );

    const actionItems = selectedApp
        ? mockApps
              .find((app) => app.id === selectedApp)
              ?.actions.map((action) => ({ label: action, value: action })) ||
          []
        : [];

    const handleSubmit = () => {
        if (!name || !description) {
            setDetailsSnackbarVisible(true);
            return;
        }

        console.log({
            name,
            description,
            selectedApp,
            selectedAction,
        });

        navigation.goBack(); // Navigate back after creation
    };

    const renderContent = () => {
        if (value === "details") {
            return (
                <WorkflowDetails
                    name={name}
                    setName={setName}
                    description={description}
                    setDescription={setDescription}
                ></WorkflowDetails>
            );
        }
        if (value === "actions") {
            return (
                <>
                    <DropDownPicker
                        open={openApp}
                        value={selectedApp}
                        items={appItems}
                        setOpen={setOpenApp}
                        setValue={setSelectedApp}
                        setItems={setAppItems}
                        placeholder="Select App"
                        zIndex={3000}
                        zIndexInverse={1000}
                    />

                    {/* Action Picker */}
                    {selectedApp && (
                        <DropDownPicker
                            open={openAction}
                            value={selectedAction}
                            items={actionItems}
                            setOpen={setOpenAction}
                            setValue={setSelectedAction}
                            placeholder="Select Action"
                            zIndex={2000}
                            zIndexInverse={500}
                        />
                    )}
                </>
            );
        }
        if (value === "reactions") {
            return (
                <TextInput
                    label="Reaction"
                    value={""} // Replace with reaction state
                    onChangeText={() => {}} // Replace with reaction setter
                    mode="outlined"
                />
            );
        }
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Create Workflow" />
            </Appbar.Header>

            <FlatList
                data={[{ key: value }]}
                renderItem={() => (
                    <StyledView className="flex-1 justify-start px-6 mt-6">
                        <SegmentedButtons
                            value={value}
                            onValueChange={(v) =>
                                setValue(
                                    v as "details" | "actions" | "reactions"
                                )
                            }
                            buttons={[
                                { value: "details", label: "Details" },
                                { value: "actions", label: "Actions" },
                                { value: "reactions", label: "Reactions" },
                            ]}
                        />
                        {renderContent()}
                    </StyledView>
                )}
                ListFooterComponent={<View style={{ height: 150 }} />}
            />

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.createButton}
                >
                    Create Workflow
                </Button>
            </View>

            {/* Snackbar for validation errors */}
            <Snackbar
                visible={detailsSnackbarVisible}
                onDismiss={() => setDetailsSnackbarVisible(false)}
                duration={3000}
            >
                Please fill in the workflow details.
            </Snackbar>
        </>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "white",
    },
    createButton: {
        width: "100%",
    },
});
