/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** profile
 */

import { View, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
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

export default function ProfilePage() {
    // Mock user data and services
    const [user, setUser] = useState({
        name: "Jane",
        surname: "Doe",
        description: "Passionate mobile developer",
        avatar: "https://i.pravatar.cc/300",
        email: "jane.doe@example.com",
        password: "password",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [tempUser, setTempUser] = useState(user);
    const [services] = useState([
        { id: 1, name: "Service 1", description: "Description of Service 1" },
        { id: 2, name: "Service 2", description: "Description of Service 2" },
    ]);
    const [showChangePasswordModal, setShowChangePasswordModal] =
        useState(false);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setTempUser(user);
        setIsEditing(false);
    };
    const handleSave = () => {
        setUser(tempUser);
        setIsEditing(false);
    };
    const handleChangePassword = () => {
        setShowChangePasswordModal(true);
    };

    useFocusEffect(
        useCallback(() => {
            return () => {
                if (isEditing) handleCancel();
            };
        }, [isEditing])
    );

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
                    <Avatar.Image size={128} source={{ uri: user.avatar }} />
                </View>
                <View>
                    <TextInput
                        label="Name"
                        mode="outlined"
                        value={tempUser.name}
                        onChangeText={(value) =>
                            setTempUser({ ...tempUser, name: value })
                        }
                        editable={isEditing}
                        style={{ marginBottom: 8 }}
                    />
                    <TextInput
                        label="Surname"
                        mode="outlined"
                        value={tempUser.surname}
                        onChangeText={(value) =>
                            setTempUser({ ...tempUser, surname: value })
                        }
                        editable={isEditing}
                        style={{ marginBottom: 8 }}
                    />
                    <TextInput
                        label="Description"
                        mode="outlined"
                        value={tempUser.description}
                        onChangeText={(value) =>
                            setTempUser({ ...tempUser, description: value })
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
