/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** profile
 */
import { Text, View, Image } from "react-native";
import React, { useState } from "react";
import { styled } from "nativewind";
import { BasicButton } from "@components/BasicButton";
import { TextInput } from "@components/TextInput";
import { TextBox } from "@components/TextBox";
import { ChangePasswordModal } from "@components/ChangePasswordModal";
import { Button } from "react-native-paper";

const StyledImage = styled(Image);

const StyledText = styled(Text);
const StyledView = styled(View);

export default function ProfilePage() {
    // Mock user data
    const [user, setUser] = useState({
        name: "Jane",
        surname: "Doe",
        avatar: "https://i.pravatar.cc/300", // email avatar??
        email: "jane.doe@example.com",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [tempUser, setTempUser] = useState(user); // state when in edit
    const [showChangePasswordModal, setShowChangePasswordModal] =
        useState(false);

    // button handlers
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
    return (
        <StyledView className="flex-1 justify-center items-center bg-white px-6">
            <StyledText className="text-3xl">Profile</StyledText>
            <StyledView className="items-center pb-6">
                <StyledImage
                    source={{ uri: user.avatar }}
                    className="w-32 h-32 rounded-full border-4 border-white mt-8"
                />
            </StyledView>
            {isEditing ? (
                <StyledView>
                    <TextInput
                        value={tempUser.name}
                        placeholder="Name"
                        onChangeText={(value) =>
                            setTempUser({ ...tempUser, name: value })
                        }
                    />
                    <TextInput
                        value={tempUser.surname}
                        placeholder="Surname"
                        onChangeText={(value) =>
                            setTempUser({ ...tempUser, surname: value })
                        }
                    />
                </StyledView>
            ) : (
                <StyledView>
                    <Text>
                        {user.name} {user.surname}
                    </Text>
                    <Button mode="outlined" onPress={handleChangePassword}>
                        Change Password
                    </Button>
                </StyledView>
            )}

            <StyledView className="px-6 py-4">
                <StyledText className="text-lg text-gray-800 font-semibold">
                    Contact Information
                </StyledText>
                <StyledText className="text-gray-600 mt-2">
                    Email: {user.email}
                </StyledText>
            </StyledView>

            {isEditing ? (
                <StyledView className="flex-row space-x-4 mt-6">
                    <BasicButton
                        title="Cancel"
                        onPress={handleCancel}
                        bgTailwind="bg-softRed"
                    />
                    <StyledView></StyledView>
                    <BasicButton
                        title="Save"
                        onPress={handleSave}
                        bgTailwind="bg-softGreen"
                    />
                </StyledView>
            ) : (
                <BasicButton title="Edit" onPress={handleEdit} />
            )}
            <ChangePasswordModal
                visible={showChangePasswordModal}
                hideModal={() => setShowChangePasswordModal(false)}
            />
        </StyledView>
    );
}
