/*
 ** EPITECH PROJECT, 2024
 ** Area mobile - components
 ** File description:
 ** ChangePasswordModal
 */

import React, { useCallback, useEffect, useState } from "react";
import {
    Modal,
    Portal,
    Text,
    Button,
    TextInput,
    Card,
} from "react-native-paper";
import { View } from "react-native";
import { styled } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PASSWORD } from "@/asyncStorageLibrary/basicRequestVars";
import { useFocusEffect } from "@react-navigation/native";

const StyledView = styled(View);

interface ChangePasswordModalProps {
    visible: boolean;
    hideModal: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    visible,
    hideModal,
}) => {
    const oldPassword = "password";
    // TODO: add password to async storage before implementing this
    // const oldPassword = async () => {
    //     const password = await AsyncStorage.getItem(PASSWORD);
    //     return password;
    // }
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<
        string | null
    >(null);

    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] =
        useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            return () => {
                if (visible) handleCancel();
            };
        }, [visible])
    );

    const handleSave = () => {
        console.log("Saving new password", {
            oldPassword,
            newPassword,
            confirmNewPassword,
        });
        //TODO: add: Request to change password here
        hideModal();
    };
    const handleCancel = () => {
        setNewPassword("");
        setConfirmNewPassword("");
        hideModal();
    };

    return (
        <Modal visible={visible} onDismiss={hideModal}>
            <Card style={{ marginBottom: 16, padding: 16 }}>
                <StyledView className="p-4">
                    <Text
                        variant="headlineLarge"
                        style={{ textAlign: "center", marginBottom: 16 }}
                    >
                        Change Password
                    </Text>
                    <TextInput
                        label="Old Password"
                        mode="outlined"
                        value={oldPassword || ""}
                        editable={false}
                        secureTextEntry={!showOldPassword}
                        right={
                            <TextInput.Icon
                                icon={showOldPassword ? "eye-off" : "eye"}
                                onPress={() =>
                                    setShowOldPassword(!showOldPassword)
                                }
                            />
                        }
                        style={{ marginBottom: 8 }}
                    />
                    <TextInput
                        label="New Password"
                        mode="outlined"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showNewPassword}
                        right={
                            <TextInput.Icon
                                icon={showNewPassword ? "eye-off" : "eye"}
                                onPress={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                            />
                        }
                        style={{ marginBottom: 8 }}
                    />
                    <TextInput
                        label="Confirm New Password"
                        mode="outlined"
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                        secureTextEntry={!showConfirmNewPassword}
                        right={
                            <TextInput.Icon
                                icon={
                                    showConfirmNewPassword ? "eye-off" : "eye"
                                }
                                onPress={() =>
                                    setShowConfirmNewPassword(
                                        !showConfirmNewPassword
                                    )
                                }
                            />
                        }
                        style={{ marginBottom: 8 }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 16,
                            justifyContent: "space-around",
                        }}
                    >
                        <Button mode="contained" onPress={handleCancel}>
                            Cancel
                        </Button>
                        <Button mode="outlined" onPress={handleSave}>
                            Save
                        </Button>
                    </View>
                </StyledView>
            </Card>
        </Modal>
    );
};
