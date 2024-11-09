/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** profile
 */

import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    View,
} from "react-native";
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
import { getUser, updateUser } from "@/services/user-management";
import { getServicesConnectedInUser } from "@/services/service-management";
import { User } from "@/services/types";
import { ServicesList } from "@/components/ServicesList";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempUser, setTempUser] = useState<User | null>(null);
    const [services, setServices] = useState<
        Array<{
            name: string;
            description: string;
            icon: React.JSX.Element;
            category: string;
        }>
    >([]);
    const availableServices = ServicesList();
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(
        false,
    );

    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingServices, setLoadingServices] = useState(true);

    const fetchUser = async () => {
        setLoadingUser(true);
        const fetchedUser = await getUser();
        if (fetchedUser) {
            setUser(fetchedUser);
            setTempUser(fetchedUser);
        }
        setLoadingUser(false);
    };

    const fetchConnectedServices = async () => {
        setLoadingServices(true);
        const connectedServices = await getServicesConnectedInUser();
        if (connectedServices) {
            const filteredServices = availableServices.filter((service) =>
                connectedServices.includes(service.name.toLowerCase())
            );
            setServices(filteredServices);
        } else {
        }
        setLoadingServices(false);
    };

    useEffect(() => {
        fetchUser();
        fetchConnectedServices();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchUser();
            fetchConnectedServices();
        }, []),
    );

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setTempUser(user);
        setIsEditing(false);
    };
    const handleSave = async () => {
        if (tempUser) {
            const originalUser = user;
            setUser(tempUser);

            const success = await updateUser(tempUser);
            if (success) {
                setIsEditing(false);
            } else {
                setUser(originalUser);
                console.log("Failed to save user data.");
            }
        }
    };
    const handleChangePassword = () => {
        setShowChangePasswordModal(true);
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                }}
            >
                <Text
                    variant="headlineLarge"
                    style={{
                        color: "#5A6ACF",
                        marginBottom: 20,
                        fontWeight: "bold",
                        marginTop: 20,
                        textAlign: "center",
                    }}
                >
                    Profile
                </Text>
                <Card style={{ marginBottom: 16, padding: 16 }}>
                    <Text
                        variant="titleLarge"
                        style={{ fontWeight: "bold", marginBottom: 16 }}
                    >
                        User details
                    </Text>
                    <Divider style={{ marginBottom: 16 }} />
                    {
                        /* <View style={{ alignItems: "center", paddingBottom: 16 }}>
                    <Avatar.Image
                        size={128}
                        source={{ uri: "https://i.pravatar.cc/300" }}
                    />
                </View> */
                    }
                    {loadingUser
                        ? <ActivityIndicator size="large" color="#5A6ACF" />
                        : (
                            <View>
                                <TextInput
                                    label="Name"
                                    mode="outlined"
                                    value={tempUser?.first_name || ""}
                                    onChangeText={(value) =>
                                        setTempUser({
                                            ...tempUser,
                                            first_name: value,
                                        } as User)}
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
                                        } as User)}
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
                                        } as User)}
                                    multiline
                                    editable={isEditing}
                                    style={{ marginBottom: 8 }}
                                />
                            </View>
                        )}
                    <Divider style={{ marginVertical: 8 }} />
                    <Text variant="bodyLarge">Email: {user?.email}</Text>

                    {isEditing
                        ? (
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
                        )
                        : (
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
                                <Button
                                    mode="outlined"
                                    onPress={handleChangePassword}
                                >
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
                    {loadingServices
                        ? <ActivityIndicator size="large" color="#5A6ACF" />
                        : services.length > 0
                        ? (
                            services.map((service) => (
                                <List.Item
                                    key={service.name}
                                    title={service.name}
                                    description={service.description}
                                    left={(props) => (
                                        <View
                                            style={{
                                                backgroundColor: "#5A6ACF",
                                                borderRadius: 100,
                                                padding: 12,
                                                marginBottom: 8,
                                                width: 60,
                                                height: 60,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            {service.icon}
                                        </View>
                                    )}
                                />
                            ))
                        )
                        : (
                            <Text
                                variant="titleMedium"
                                style={{
                                    textAlign: "center",
                                    marginTop: 20,
                                }}
                            >
                                No Services connected
                            </Text>
                        )}
                </Card>
                <ChangePasswordModal
                    visible={showChangePasswordModal}
                    hideModal={() => setShowChangePasswordModal(false)}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
