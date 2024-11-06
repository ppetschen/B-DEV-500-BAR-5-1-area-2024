/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** profile
 */

import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { ChangePasswordModal } from "@components/ChangePasswordModal";
import {
    Avatar,
    Button,
    Card,
    Divider,
    List,
    Text,
    TextInput,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { getUser, updateUser } from "@/services/user-management"; // Import updateUser function
import { User } from "@/services/types";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempUser, setTempUser] = useState<User | null>(null);
    const [services] = useState([
        { id: 1, name: "Service 1", description: "Description of Service 1" },
        { id: 2, name: "Service 2", description: "Description of Service 2" },
    ]);
    const [showChangePasswordModal, setShowChangePasswordModal] =
        useState(false);

    // Fetch user data from the server
    const fetchUser = async () => {
        const fetchedUser = await getUser();
        if (fetchedUser) {
            setUser(fetchedUser);
            setTempUser(fetchedUser);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchUser();
        }, [])
    );

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        setTempUser(user);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (tempUser) {
            const originalUser = user; // backup of the original user data
            setUser(tempUser); // Update UI with new data

            const success = await updateUser(tempUser);
            if (success) {
                setIsEditing(false);
            } else {
                setUser(originalUser); // Revert to original user data on failure
                console.log("Failed to save user data.");
            }
        }
    };

    const handleChangePassword = () => {
        setShowChangePasswordModal(true);
    };

    if (!user) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                padding: 16,
                backgroundColor: "#ffffff",
            }}
        >
            <Text
                variant="headlineLarge"
                style={{ textAlign: "center", marginBottom: 16 }}
            >
                Profile
            </Text>
            <Card style={{ marginBottom: 16, padding: 16 }}>
                <View style={{ alignItems: "center", paddingBottom: 16 }}>
                    <Avatar.Image
                        size={128}
                        source={{
                            uri: "https://i.pravatar.cc/300",
                        }}
                    />
                </View>
                <View>
                    <TextInput
                        label="Name"
                        mode="outlined"
                        value={tempUser?.first_name || ""}
                        onChangeText={(value) =>
                            setTempUser({
                                ...tempUser,
                                first_name: value,
                            } as User)
                        }
                        editable={isEditing}
                        style={{ marginBottom: 8 }}
                    />
                    <TextInput
                        label="Surname"
                        mode="outlined"
                        value={tempUser?.last_name || ""}
                        onChangeText={(value) =>
                            setTempUser({
                                ...tempUser,
                                last_name: value,
                            } as User)
                        }
                        editable={isEditing}
                        style={{ marginBottom: 8 }}
                    />
                    <TextInput
                        label="Description"
                        mode="outlined"
                        value={tempUser?.description || ""}
                        onChangeText={(value) =>
                            setTempUser({
                                ...tempUser,
                                description: value,
                            } as User)
                        }
                        multiline
                        editable={isEditing}
                        style={{ marginBottom: 8 }}
                    />
                </View>
                <Divider style={{ marginVertical: 8 }} />
                <Text variant="bodyLarge">Email: {user.email}</Text>

                {isEditing ? (
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 16,
                            justifyContent: "space-around",
                        }}
                    >
                        <Button
                            mode="contained"
                            onPress={handleCancel}
                            buttonColor="#FF6B6B"
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            buttonColor="#4CAF50"
                        >
                            Save
                        </Button>
                    </View>
                ) : (
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 16,
                            justifyContent: "space-around",
                        }}
                    >
                        <Button mode="contained" onPress={handleEdit}>
                            Edit
                        </Button>
                        <Button mode="outlined" onPress={handleChangePassword}>
                            Change Password
                        </Button>
                    </View>
                )}
            </Card>

            <Card style={{ padding: 16 }}>
                <Text
                    variant="titleLarge"
                    style={{ fontWeight: "bold", marginBottom: 16 }}
                >
                    Added Services
                </Text>
                <Divider style={{ marginBottom: 16 }} />
                {services.map((service) => (
                    <List.Item
                        key={service.id}
                        title={service.name}
                        description={service.description}
                        left={(props) => <List.Icon {...props} icon="folder" />}
                    />
                ))}
            </Card>
            <ChangePasswordModal
                visible={showChangePasswordModal}
                hideModal={() => setShowChangePasswordModal(false)}
            />
        </ScrollView>
    );
}
