/*
 ** EPITECH PROJECT, 2024
 ** Area
 ** File description:
 ** ServicesList
 */

import React from "react";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconMaterial from "react-native-vector-icons/MaterialIcons";

export function ServicesList(): {
    name: string;
    description: string;
    icon: React.JSX.Element;
    category: string;
}[] {
    return [
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
        {
            name: "Twitch",
            description: "Twitch is a live-stream platform",
            icon: <IconFontAwesome name="twitch" size={32} color="#fff" />,
            category: "Live Streaming",
        },
        {
            name: "Google-Mail",
            description: "Google Mail is an email service",
            icon: (
                <IconMaterialCommunityIcons
                    name="gmail"
                    size={32}
                    color="#fff"
                />
            ),
            category: "Productivity",
        },
        {
            name: "Google-Drive",
            description: "Google drive is a cloud storage service",
            icon: (
                <IconMaterialCommunityIcons
                    name="google-drive"
                    size={32}
                    color="#fff"
                />
            ),
            category: "Productivity",
        },
        {
            name: "Google-Calendar",
            description: "Google Calendar is a calendar service",
            icon: <IconFontAwesome name="google" size={32} color="#fff" />,
            category: "Productivity",
        },
        // {
        //     name: "Notion",
        //     description: "Notion is a versatile workspace tool",
        //     icon: (
        //         <IconMaterialCommunityIcons
        //             name="notion"
        //             size={32}
        //             color="#fff"
        //         />
        //     ),
        //     category: "Productivity",
        // },
    ];
}
