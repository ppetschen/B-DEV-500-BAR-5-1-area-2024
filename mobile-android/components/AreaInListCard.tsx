/*
 ** EPITECH PROJECT, 2024
 ** stupidArea
 ** File description:
 ** AreaInListCard
 */

// RecentActivityCard.tsx
import React from "react";
import { Card, Text, Button, Avatar } from "react-native-paper";
import { View, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface AreaInListCardProps {
    name: string;
    date: string;
    url: string;
    services: React.JSX.Element[];
    status: string;
    onTest: (url: string) => void;
}

const AreaInListCard: React.FC<AreaInListCardProps> = ({
    name,
    date,
    url,
    services,
    status,
    onTest,
}) => {
    const statusColor =
        status === "success"
            ? "#4CAF50"
            : status === "pending"
            ? "#FFC107"
            : "#F44336";
    return (
        <Card style={{ marginBottom: 15 }}>
            <Card.Title
                title={name}
                subtitle={date}
                left={(props) => (
                    <Avatar.Icon
                        {...props}
                        icon={() => (
                            <Icon
                                name={name.toLowerCase()}
                                size={30}
                                color="#FFF"
                                style={{ backgroundColor: "#5A6ACF" }}
                            />
                        )}
                        color="#FFF"
                        style={{ backgroundColor: "#5A6ACF" }}
                    />
                )}
            />

            <Card.Content>
                <Text variant="bodyMedium">{url}</Text>
            </Card.Content>
            <Card.Actions>
                <Button
                    mode="outlined"
                    onPress={() => onTest(url)}
                    style={{ marginRight: 10 }}
                >
                    Test Area
                </Button>
                <Button
                    mode="contained-tonal"
                    style={{ backgroundColor: statusColor }}
                >
                    {status}
                </Button>
            </Card.Actions>
        </Card>
    );
};

export default AreaInListCard;
