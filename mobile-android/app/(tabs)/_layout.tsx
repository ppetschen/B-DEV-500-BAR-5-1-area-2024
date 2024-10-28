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
                    title: "Dashboard",
                    tabBarIcon: ({ color }) => (
                        <Icon name="extension" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: "Services",
                    tabBarIcon: ({ color }) => (
                        <Icon name="widgets" size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="automation"
                options={{
                    title: "Automation",
                    tabBarIcon: ({ color }) => (
                        <Icon name="sync" size={28} color={color} />
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
