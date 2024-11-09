/*
 ** EPITECH PROJECT, 2024
 ** Area mobile - components
 ** File description:
 ** ChangePasswordModal
 */

import React, { useCallback, useEffect, useState } from "react";
import {
    Modal,
    Text,
    Button,
    TextInput,
    Card,
    Snackbar,
} from "react-native-paper";
import { View } from "react-native";
import { styled } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PASSWORD } from "@/asyncStorageLibrary/basicRequestVars";
import { useFocusEffect } from "@react-navigation/native";
import { updateUser } from "@/services/user-management";

const StyledView = styled(View);

interface ChangePasswordModalProps {
    visible: boolean;
    hideModal: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    visible,
    hideModal,
}) => {
    const [oldPassword, setOldPassword] = useState<string>("");
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

    const [snakBarMessage, setSnackbarMessage] = useState<string>("");
    const [snakbarVisible, setSnackbarVisible] = useState<boolean>(false);
    useEffect(() => {
        const getPassword = async () => {
            const password = await AsyncStorage.getItem(PASSWORD);
            setOldPassword(password || "");
        };
        getPassword();
    });

    useFocusEffect(
        useCallback(() => {
            return () => {
                if (visible) handleCancel();
            };
        }, [visible])
    );

    const handleSave = async () => {
        let valid = true;
        if (!newPassword) {
            setPasswordError("Password is required");
            valid = false;
        } else if (newPassword === oldPassword) {
            setPasswordError(
                "New password must be different from old password"
            );
            valid = false;
        }
        if (newPassword !== confirmNewPassword) {
            setConfirmPasswordError(
                "Password confirmation must match password"
            );
            valid = false;
        }
        console.log("Saving new password", {
            oldPassword,
            newPassword,
            confirmNewPassword,
        });
        if (valid) {
            const response = await updateUser({ new_password: newPassword });

            if (response) {
                setSnackbarMessage("Password updated successfully");
                AsyncStorage.setItem(PASSWORD, newPassword || "");
            } else {
                setSnackbarMessage("Error updating password");
            }
            setSnackbarVisible(true);
            setTimeout(() => {
                setSnackbarVisible(false);
                hideModal();
            }, 3000);
        }
    };
    const handleCancel = () => {
        setNewPassword("");
        setConfirmNewPassword("");
        setPasswordError(null);
        setConfirmPasswordError(null);
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
                        onChangeText={(text) => {
                            setNewPassword(text);
                            setPasswordError(null);
                        }}
                        secureTextEntry={!showNewPassword}
                        right={
                            <TextInput.Icon
                                icon={showNewPassword ? "eye-off" : "eye"}
                                onPress={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                            />
                        }
                        error={!!passwordError}
                        style={{ marginBottom: 8 }}
                    />
                    {passwordError && (
                        <Text style={{ color: "red", marginBottom: 8 }}>
                            {passwordError}
                        </Text>
                    )}
                    <TextInput
                        label="Confirm New Password"
                        mode="outlined"
                        value={confirmNewPassword}
                        onChangeText={(text) => {
                            setConfirmNewPassword(text);
                            setConfirmPasswordError(null);
                        }}
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
                        error={!!confirmPasswordError}
                        style={{ marginBottom: 8 }}
                    />
                    {confirmPasswordError && (
                        <Text style={{ color: "red", marginBottom: 8 }}>
                            {confirmPasswordError}
                        </Text>
                    )}
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
            <Snackbar
                visible={snakbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                {snakBarMessage}
            </Snackbar>
        </Modal>
    );
};
