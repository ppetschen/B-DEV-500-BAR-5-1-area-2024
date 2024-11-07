import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
    Card,
    Menu,
    Provider as PaperProvider,
    Text,
    TextInput,
} from "react-native-paper";
import {
    composeArea,
    getAvailableAreas,
    getCompletions,
} from "@/services/area-composition";
import { useRouter } from "expo-router";

export default function Workflow() {
    const [error, setError] = useState<string | null>(null);
    const [areas, setAreas] = useState<
        { actions: string[]; reactions: string[] } | null
    >(null);
    const [completions, setCompletions] = useState<
        {
            from: { data: Record<string, unknown>[] };
            to: { data: Record<string, unknown>[] };
        } | null
    >(null);
    const [action, setAction] = useState<string | null>(null);
    const [reaction, setReaction] = useState<string | null>(null);
    const [actionMenuVisible, setActionMenuVisible] = useState(false);
    const [reactionMenuVisible, setReactionMenuVisible] = useState(false);
    const [actionContents, setActionContents] = useState<
        Record<string, string> | null
    >(null);
    const [reactionContents, setReactionContents] = useState<
        Record<string, string> | null
    >(null);
    const [dynamicMenuVisibility, setDynamicMenuVisibility] = useState<
        Record<string, boolean>
    >({});
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
            getCompletions({ from: action, to: reaction })
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
        }
    }, [action, reaction]);

    const toggleDynamicMenu = (key: string) => {
        setDynamicMenuVisibility((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const renderDynamicDropdowns = (
        data: Record<string, unknown>[],
        setSelectedContent: React.Dispatch<
            React.SetStateAction<Record<string, string> | null>
        >,
        contentType: string,
    ) => {
        const uniqueKeys = new Set<string>();

        return data.flatMap((item) => Object.keys(item))
            .filter((key) => {
                const isUnique = !uniqueKeys.has(key);
                if (isUnique) uniqueKeys.add(key);
                return isUnique;
            })
            .map((key) => (
                <View key={key} style={styles.dropdownContainer}>
                    <Text style={styles.dropdownTitle}>{key}</Text>
                    <Menu
                        visible={dynamicMenuVisibility[key] || false}
                        onDismiss={() => toggleDynamicMenu(key)}
                        anchor={
                            <Text
                                onPress={() => toggleDynamicMenu(key)}
                                style={styles.dropdownButton}
                            >
                                {contentType === "action"
                                    ? actionContents?.[key] || `Select ${key}`
                                    : reactionContents?.[key] ||
                                        `Select ${key}`}
                            </Text>
                        }
                    >
                        {data.filter((elem) => elem[key]).map((elem) => (
                            <Menu.Item
                                key={`${key}-${JSON.stringify(elem)}`}
                                onPress={() => {
                                    setSelectedContent((prev) => ({
                                        ...prev,
                                        [key]: String(elem[key]),
                                    }));
                                    toggleDynamicMenu(key);
                                }}
                                title={String(elem[key])}
                            />
                        ))}
                    </Menu>
                </View>
            ));
    };

    return (
        <PaperProvider>
            <ScrollView style={styles.container}>
                <Text style={styles.header}>New AREA</Text>
                {error && <Text style={styles.errorText}>Error: {error}</Text>}

                <View style={styles.dropdownContainer}>
                    <Text style={styles.dropdownTitle}>Action</Text>
                    <Menu
                        visible={actionMenuVisible}
                        onDismiss={() => setActionMenuVisible(false)}
                        anchor={
                            <Text
                                onPress={() => setActionMenuVisible(true)}
                                style={styles.dropdownButton}
                            >
                                {action || "Select Action"}
                            </Text>
                        }
                    >
                        {areas?.actions.map((actionOption) => (
                            <Menu.Item
                                key={actionOption}
                                onPress={() => {
                                    setAction(actionOption);
                                    setActionMenuVisible(false);
                                    setReaction(null);
                                    setCompletions(null);
                                }}
                                title={actionOption}
                            />
                        ))}
                    </Menu>

                    <Text style={styles.dropdownTitle}>Reaction</Text>
                    <Menu
                        visible={reactionMenuVisible}
                        onDismiss={() => setReactionMenuVisible(false)}
                        anchor={
                            <Text
                                onPress={() => setReactionMenuVisible(true)}
                                style={styles.dropdownButton}
                            >
                                {reaction || "Select Reaction"}
                            </Text>
                        }
                    >
                        {areas?.reactions.map((reactionOption) => (
                            <Menu.Item
                                key={reactionOption}
                                onPress={() => {
                                    setReaction(reactionOption);
                                    setReactionMenuVisible(false);
                                }}
                                title={reactionOption}
                            />
                        ))}
                    </Menu>
                </View>

                {completions && (
                    <>
                        <Text style={styles.dropdownTitle}>Action Content</Text>
                        <View key={`action-content`}>
                            {renderDynamicDropdowns(
                                completions.from.data,
                                setActionContents,
                                "action",
                            )}
                        </View>

                        <Text style={styles.dropdownTitle}>
                            Reaction Content
                        </Text>
                        <View key={`reaction-content`}>
                            {renderDynamicDropdowns(
                                completions.to.data,
                                setReactionContents,
                                "reaction",
                            )}
                        </View>
                    </>
                )}

                {actionContents && reactionContents && (
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownTitle}>
                            Content
                        </Text>
                        <TextInput
                            onChangeText={setContent}
                            label="Supports EJS"
                            mode="outlined"
                            placeholder="Hello from repo <%= repository.full_name %>"
                            multiline
                            style={{ marginBottom: 20 }}
                        />
                    </View>
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
                            const { reaction_id, action_id } =
                                await composeArea({
                                    from: {
                                        type: action as string,
                                        context: actionContents,
                                    },
                                    to: {
                                        type: reaction as string,
                                        context: reactionContents,
                                    },
                                    markup: content,
                                });

                            if (reaction_id && action_id) {
                                router.push("/dashboard");
                            }

                            setError("Failed to create AREA");
                            setAction(null);
                            setReaction(null);
                            setActionContents(null);
                            setReactionContents(null);
                            setContent(null);
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                textAlign: "center",
                            }}
                        >
                            Submit
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
    dropdownTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
        textAlign: "left",
    },
    dropdownButton: {
        width: "100%",
        marginBottom: 10,
        paddingVertical: 10,
        backgroundColor: "#e0e0e0",
        borderRadius: 8,
        textAlign: "center",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
});
