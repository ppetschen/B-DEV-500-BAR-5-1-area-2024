/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** profile
 */

import React, { useState } from "react";
import {
    View,
    FlatList,
    Pressable,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { authenticateToService } from "@/services/service-management";
import { SafeAreaView } from "react-native-safe-area-context";
import { ServicesList } from "@/components/ServicesList";
import { Text } from "react-native-paper";

export default function ServicesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const services = ServicesList();

    const filteredServices = selectedCategory
        ? services.filter((service) => service.category === selectedCategory)
        : services;

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <View style={{ padding: 6 }}>
                <Text
                    variant="headlineLarge"
                    style={{
                        color: "#5A6ACF",
                        marginBottom: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    Services
                </Text>
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
                        "Live Streaming",
                    ].map((category) => (
                        <Pressable
                            key={category}
                            onPress={() =>
                                setSelectedCategory(category === "All" ? null : category)
                            }
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 20,
                                marginRight: 8,
                                backgroundColor:
                                    selectedCategory === category ||
                                    (category === "All" && selectedCategory === null)
                                        ? "#5A6ACF"
                                        : "transparent",
                            }}
                        >
                            <Text
                                variant="labelMedium"
                                style={{
                                    color:
                                        selectedCategory === category ||
                                        (category === "All" && selectedCategory === null)
                                            ? "#fff"
                                            : "#5A6ACF",
                                    fontSize: 14,
                                }}
                            >
                                {category}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                <FlatList
                    data={filteredServices}
                    keyExtractor={(item) => item.name}
                    // numColumns={2}
                    // columnWrapperStyle={{ justifyContent: "space-between" }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={async () => {
                                const service = item.name.toLowerCase();
                                const result = await authenticateToService(service);
                                if (!result) {
                                    console.log(`Failed to authenticate to ${item.name}`);
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
                                {item.icon}
                            </View>
                            <Text
                                variant="labelMedium"
                                style={{
                                    color: "#273240",
                                    marginBottom: 10,
                                    fontWeight: "bold",
                                }}
                            >
                                {item.name}
                            </Text>
                            <Text
                                variant="labelSmall"
                                style={{
                                    color: "#4b5563",
                                }}
                            >
                                {item.description}
                            </Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </SafeAreaView>
    );
}
