/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** profile
 */

import React, { useState } from "react";
import {
    Text,
    View,
    FlatList,
    Pressable,
    TouchableOpacity,
    ScrollView,
    Linking,
} from "react-native";
import { styled } from "nativewind";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import { authenticateToService } from "@/services/service-management";
import { SafeAreaView } from "react-native-safe-area-context";

const StyledText = styled(Text);
const StyledView = styled(View);

export default function ServicesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const services = [
        {
            name: "Google",
            description: "Google is a search engine",
            icon: <IconFontAwesome name="google" size={32} color="#fff" />,
            category: "Productivity",
        },
        {
            name: "GitHub",
            description: "GitHub is a code hosting platform",
            icon: <IconFontAwesome name="github" size={32} color="#fff" />,
            category: "Developer Tools",
        },
        {
            name: "Facebook",
            description: "Facebook is a social media platform",
            icon: <IconFontAwesome name="facebook" size={32} color="#fff" />,
            category: "Advertising",
        },
        {
            name: "Outlook",
            description: "Outlook is an email service",
            icon: (
                <IconMaterialCommunityIcons
                    name="microsoft-outlook"
                    size={32}
                    color="#fff"
                />
            ),
            category: "Productivity",
        },
        {
            name: "Discord",
            description: "Discord is a communication platform",
            icon: <IconMaterial name="discord" size={32} color="#fff" />,
            category: "Communication",
        },
    ];

    const filteredServices = selectedCategory
        ? services.filter((service) => service.category === selectedCategory)
        : services;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F9" }}>
            <StyledView className="p-6">
                <StyledText className="text-3xl font-bold text-[#5A6ACF] mb-6 text-center">
                    SERVICES
                </StyledText>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                    {[
                        "All",
                        "Advertising",
                        "Productivity",
                        "Communication",
                        "Developer Tools",
                    ].map((category) => (
                        <Pressable
                            key={category}
                            onPress={() =>
                                setSelectedCategory(
                                    category === "All" ? null : category
                                )
                            }
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 20,
                                marginRight: 8,
                                backgroundColor:
                                    selectedCategory === category ||
                                    (category === "All" &&
                                        selectedCategory === null)
                                        ? "#5A6ACF"
                                        : "transparent",
                            }}
                        >
                            <StyledText
                                style={{
                                    fontSize: 14,
                                    color:
                                        selectedCategory === category ||
                                        (category === "All" &&
                                            selectedCategory === null)
                                            ? "#fff"
                                            : "#5A6ACF",
                                }}
                            >
                                {category}
                            </StyledText>
                        </Pressable>
                    ))}
                </ScrollView>

                <FlatList
                    data={filteredServices}
                    keyExtractor={(item) => item.name}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={async () => {
                                const url = await authenticateToService(
                                    item.name.toLowerCase()
                                );
                                console.log("URL:", url);
                                if (url) {
                                  //* Open the URL
                                    console.log("URL:", url);
                                    console.log(`Next step: Open the URL`);
                                } else {
                                    console.log(
                                        `Failed to authenticate to ${item.name}`
                                    );
                                }
                            }}
                            style={{
                                backgroundColor: "white",
                                padding: 16,
                                borderRadius: 15,
                                margin: 8,
                                width: 160,
                                alignItems: "center",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 4,
                            }}
                        >
                            <StyledView
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
                                {item.icon}
                            </StyledView>
                            <StyledText className="text-lg font-bold text-[#273240] mb-1">
                                {item.name}
                            </StyledText>
                            <StyledText className="text-sm text-gray-600 text-center">
                                {item.description}
                            </StyledText>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </StyledView>
        </SafeAreaView>
    );
}
