/*
 ** EPITECH PROJECT, 2024
 ** Area
 ** File description:
 ** workflow creation page
 */
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput, Card, Divider, Snackbar } from "react-native-paper";
import { composeArea, getAvailableAreas, getCompletions } from "@/services/area-composition";
import { useRouter } from "expo-router";
import DropdownSelector from "@/components/DropdownSelector";

export default function Workflow() {
    const [error, setError] = useState<string | null>(null);
    const [areas, setAreas] = useState<{ actions: string[]; reactions: string[] } | null>(null);
    const [completions, setCompletions] = useState<{
        from: { data: Record<string, unknown>[] };
        to: { data: Record<string, unknown>[] };
    } | null>(null);
    const [action, setAction] = useState<{ label: string; value: string } | null>(null);
    const [reaction, setReaction] = useState<{ label: string; value: string } | null>(null);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [reactionModalVisible, setReactionModalVisible] = useState(false);
    const [actionContents, setActionContents] = useState<Record<string, string> | null>(null);
    const [reactionContents, setReactionContents] = useState<Record<string, string> | null>(null);
    const [dynamicMenuVisibility, setDynamicMenuVisibility] = useState<Record<string, boolean>>({});
    const [content, setContent] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        getAvailableAreas()
            .then((data) => {
                setAreas(data);
                setError(null);
            })
            .catch((err) => {
                setError(err.message || "An error occurred");
            });
    }, []);

    useEffect(() => {
        if (action && reaction) {
            getCompletions({ from: action.value, to: reaction.value })
                .then((data) => {
                    setCompletions({
                        from: data.from as any,
                        to: data.to as any,
                    });
                    setError(null);
                })
                .catch((err) => {
                    setError(err.message || "An error occurred");
                });

            if (completions) {
                console.log("####################################################");
                console.log("####################################################");
                console.log("##                  COMPLETIONS                   ##");
                console.log("####################################################");
                console.log("####################################################");
                console.log("Action Completions:", JSON.stringify(completions.from.data, null, 2));
                console.log("Reaction Completions:", JSON.stringify(completions.to.data, null, 2));
            }
        }
    }, [action, reaction]);

    const convertToDropdownItems = (items: string[]) =>
        items.map((item) => ({ label: item, value: item }));

    const toggleDynamicMenu = (key: string) => {
        setDynamicMenuVisibility((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const renderDynamicDropdowns = (
        data: Record<string, unknown>[],
        setSelectedContent: React.Dispatch<React.SetStateAction<Record<string, string> | null>>,
        contentType: string
    ) => {
        const uniqueKeys = new Set<string>();

        return data
            .flatMap((item) => Object.keys(item))
            .filter((key) => {
                const isUnique = !uniqueKeys.has(key);
                if (isUnique) uniqueKeys.add(key);
                return isUnique;
            })
            .map((key) => (
                <Card key={key} style={{ marginBottom: 16, padding: 16, marginHorizontal: 10 }}>
                    <Text variant="titleLarge" style={{ fontWeight: "bold", marginBottom: 16 }}>
                        {key}
                    </Text>
                    <Divider style={{ marginBottom: 16 }} />
                    {/* <Text style={styles.dropdownTitle}>{key}</Text> */}
                    <DropdownSelector
                        title={`Select ${key}`}
                        items={data
                            .filter((elem) => elem[key])
                            .map((elem) => ({
                                label: String(elem[key]),
                                value: String(elem[key]),
                            }))}
                        selectedItem={{
                            label:
                                contentType === "action"
                                    ? actionContents?.[key] || `Select ${key}`
                                    : reactionContents?.[key] || `Select ${key}`,
                            value: key,
                        }}
                        onSelect={(item) => {
                            setSelectedContent((prev) => ({
                                ...prev,
                                [key]: item.label,
                            }));
                        }}
                        modalVisible={dynamicMenuVisibility[key] || false}
                        setModalVisible={() => toggleDynamicMenu(key)}
                    />
                </Card>
            ));
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <Text
                variant="headlineLarge"
                style={{
                    color: "#5A6ACF",
                    marginBottom: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                NEW AREA
            </Text>
            {error && (
                <Snackbar
                    visible={true}
                    style={{ backgroundColor: "red" }}
                    onDismiss={function (): void {
                        setError(null);
                    }}
                >
                    {error}
                </Snackbar>
            )}
            {/* {error && <Text style={styles.errorText}>Error: {error}</Text>} */}
            <ScrollView style={styles.container}>
                {/* <Text style={styles.header}>New AREA</Text> */}

                <Card style={{ marginBottom: 16, padding: 16, marginHorizontal: 10 }}>
                    <Text variant="titleLarge" style={{ fontWeight: "bold", marginBottom: 16 }}>
                        Action
                    </Text>
                    <Divider style={{ marginBottom: 16 }} />
                    <DropdownSelector
                        title="Select Action"
                        items={convertToDropdownItems(areas?.actions || [])}
                        selectedItem={action}
                        onSelect={(item) => {
                            setAction(item);
                            setReaction(null);
                            setCompletions(null);
                        }}
                        modalVisible={actionModalVisible}
                        setModalVisible={setActionModalVisible}
                    />
                </Card>
                <Card style={{ marginBottom: 16, padding: 16, marginHorizontal: 10 }}>
                    <Text variant="titleLarge" style={{ fontWeight: "bold", marginBottom: 16 }}>
                        Reaction
                    </Text>
                    <Divider style={{ marginBottom: 16 }} />
                    <DropdownSelector
                        title="Select Reaction"
                        items={convertToDropdownItems(areas?.reactions || [])}
                        selectedItem={reaction}
                        onSelect={setReaction}
                        modalVisible={reactionModalVisible}
                        setModalVisible={setReactionModalVisible}
                    />
                </Card>

                {completions && (
                    <>
                        {/* <Text style={styles.dropdownTitle}>Action Content</Text> */}
                        <View key={`action-content`}>
                            {renderDynamicDropdowns(
                                completions.from.data,
                                setActionContents,
                                "action"
                            )}
                        </View>

                        {/* <Text style={styles.dropdownTitle}>Reaction Content</Text> */}
                        <View key={`reaction-content`}>
                            {renderDynamicDropdowns(
                                completions.to.data,
                                setReactionContents,
                                "reaction"
                            )}
                        </View>
                    </>
                )}

                {actionContents && reactionContents && (
                    <Card style={{ marginBottom: 16, padding: 16, marginHorizontal: 10 }}>
                        <Text variant="titleLarge" style={{ fontWeight: "bold", marginBottom: 16 }}>
                            Content
                        </Text>
                        <Divider style={{ marginBottom: 16 }} />
                        <TextInput
                            onChangeText={setContent}
                            label="Supports EJS"
                            mode="outlined"
                            placeholder="Hello from repo <%= repository.full_name %>"
                            multiline
                            style={{ marginBottom: 20 }}
                        />
                    </Card>
                )}

                {content && (
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#333",
                            padding: 10,
                            borderRadius: 8,
                            marginBottom: 70,
                        }}
                        disabled={!action || !reaction}
                        onPress={async () => {
                            if (action && reaction) {
                                // Ensure action and reaction are non-null
                                const { reaction_id, action_id } = await composeArea({
                                    from: { type: action.value, context: actionContents },
                                    to: { type: reaction.value, context: reactionContents },
                                    markup: content,
                                });

                                if (reaction_id && action_id) {
                                    router.push("/dashboard");
                                } else {
                                    setError("Failed to create AREA");
                                    setAction(null);
                                    setReaction(null);
                                    setActionContents(null);
                                    setReactionContents(null);
                                    setContent(null);
                                }
                            }
                        }}
                    >
                        <Text style={{ color: "#fff", textAlign: "center" }}>Submit</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f5f5f5",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
        color: "#333",
    },
    dropdownContainer: {
        marginBottom: 20,
        borderRadius: 12,
        overflow: "hidden",
    },
    // dropdownTitle: {
    //     fontSize: 16,
    //     fontWeight: "bold",
    //     color: "#333",
    //     marginBottom: 8,
    //     textAlign: "left",
    // },
    errorText: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
});
