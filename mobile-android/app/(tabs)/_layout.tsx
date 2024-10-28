/*
 ** EPITECH PROJECT, 2024
 ** mobile
 ** File description:
 ** _layout for tabs
 */

import { Tabs, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function TabsLayout() {
    const router = useRouter();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.light.text.navBar.active,
                tabBarInactiveTintColor: Colors.light.text.navBar.inactive,
                tabBarActiveBackgroundColor: Colors.light.bg.active,

                tabBarStyle: {
                    backgroundColor: Colors.light.bg.navBar,
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Workflows",
                    tabBarIcon: ({ color }) => (
                        <Icon name="extension" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <Icon name="person" size={28} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}