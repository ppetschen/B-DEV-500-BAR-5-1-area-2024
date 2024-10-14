import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { setupArea } from "@/utils/client";
import { useNavigation } from "@react-navigation/native";

export default function AppSelector(): JSX.Element {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [actionSource, setActionSource] = useState<string>("None");
    const [actionKind, setActionKind] = useState<string>("");
    const [reactionDestination, setReactionDestination] = useState<string>("");
    const [reactionKind, setReactionKind] = useState<string>("");
    const [reactionPayload, setReactionPayload] = useState<string>("");
    const [webhookUrl, setWebhookUrl] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [fileContent, setFileContent] = useState<string>("");

    const navigation = useNavigation();

    const steps = ["Select Action", "Configure Reaction"];

    const actionOptions: { [key: string]: string[] } = {
        Google: ["Sheet Created", "File Uploaded", "Calendar Event"],
        Github: ["Issue Created", "Pull Request Created", "Commit Added"],
        Outlook: ["Email Dispatched"],
        Jira: ["Issue Created", "Issue Updated", "Issue Deleted"],
    };

    const handleNext = (): void => {
        if (activeStep === steps.length - 1) {
            const areaData = {
                from_service_name: actionSource.toUpperCase(),
                from_event_type: actionKind.split(" ").join("_").toUpperCase(),
                from_payload: reactionDestination === "Discord"
                    ? {
                        message_content: reactionPayload,
                    }
                    : {
                        file_name: fileName,
                        file_content: fileContent,
                    },
                to_service_name: reactionDestination,
                to_execution_endpoint: reactionDestination === "Discord"
                    ? webhookUrl
                    : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
            };

            setupArea(areaData);
            // @ts-ignore
            navigation.navigate("index");
        } else {
        }
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = (): void => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>App Selector</Text>

            <ScrollView style={styles.card}>
                <Text style={styles.stepTitle}>{steps[activeStep]}</Text>

                {activeStep === 0 && (
                    <>
                        <Text style={styles.label}>Action Source</Text>
                        <Picker
                            selectedValue={actionSource}
                            onValueChange={(itemValue) => {
                                setActionSource(itemValue);
                                setActionKind("");
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item
                                label="Select Action Source"
                                value="None"
                            />
                            <Picker.Item label="Google" value="Google" />
                            <Picker.Item label="Github" value="Github" />
                            <Picker.Item label="Outlook" value="Outlook" />
                            <Picker.Item label="Jira" value="Jira" />
                        </Picker>

                        <Text style={styles.label}>Action Kind</Text>
                        <Picker
                            selectedValue={actionKind}
                            onValueChange={(itemValue) =>
                                setActionKind(itemValue)}
                            enabled={actionSource !== "None"}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Action Kind" value="" />
                            {actionSource !== "None" &&
                                actionOptions[actionSource]?.map((action) => (
                                    <Picker.Item
                                        key={action}
                                        label={action}
                                        value={action}
                                    />
                                ))}
                        </Picker>
                    </>
                )}

                {activeStep === 1 && (
                    <>
                        <Text style={styles.label}>Reaction Destination</Text>
                        <Picker
                            selectedValue={reactionDestination}
                            onValueChange={(itemValue) => {
                                setReactionDestination(itemValue);
                                setReactionKind("");
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item
                                label="Select Reaction Destination"
                                value=""
                            />
                            <Picker.Item label="Discord" value="Discord" />
                            <Picker.Item label="Google" value="Google" />
                        </Picker>

                        <Text style={styles.label}>Reaction Kind</Text>
                        <Picker
                            selectedValue={reactionKind}
                            onValueChange={(itemValue) =>
                                setReactionKind(itemValue)}
                            enabled={!!reactionDestination}
                            style={styles.picker}
                        >
                            <Picker.Item
                                label="Select Reaction Kind"
                                value=""
                            />
                            {reactionDestination === "Discord" && (
                                <Picker.Item
                                    label="Discord Webhook"
                                    value="Webhook"
                                />
                            )}
                            {reactionDestination === "Google" && (
                                <Picker.Item
                                    label="Google Drive File"
                                    value="DriveFile"
                                />
                            )}
                        </Picker>

                        {reactionDestination === "Discord" && (
                            <>
                                <Text style={styles.label}>
                                    Message Content
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    multiline
                                    value={reactionPayload}
                                    onChangeText={setReactionPayload}
                                    placeholder="Enter message content for Discord"
                                />

                                <Text style={styles.label}>Webhook URL</Text>
                                <TextInput
                                    style={styles.input}
                                    value={webhookUrl}
                                    onChangeText={setWebhookUrl}
                                    placeholder="https://discord.com/api/webhooks/..."
                                />
                            </>
                        )}

                        {reactionDestination === "Google" && (
                            <>
                                <Text style={styles.label}>File Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={fileName}
                                    onChangeText={setFileName}
                                    placeholder="Enter the file name for Google Drive"
                                />

                                <Text style={styles.label}>File Content</Text>
                                <TextInput
                                    style={styles.input}
                                    multiline
                                    value={fileContent}
                                    onChangeText={setFileContent}
                                    placeholder="Enter the file content for Google Drive"
                                />
                            </>
                        )}
                    </>
                )}
            </ScrollView>

            <View style={styles.buttonContainer}>
                {activeStep > 0 && (
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleNext} style={styles.button}>
                    <Text style={styles.buttonText}>
                        {activeStep === steps.length - 1 ? "Complete" : "Next"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f4f4f4", // Lighter background for contrast
        justifyContent: "flex-start",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        color: "#333",
    },
    card: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 30,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 20,
        color: "#007BFF",
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
        color: "#333",
    },
    picker: {},
    input: {
        height: 60,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#007BFF",
        borderRadius: 5,
        marginLeft: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});
