import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
} from "react-native";
import { Card, Text, Button, Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import PagerView from "react-native-pager-view";

//TODO: connect to back + better styling
interface Metric {
    label: string;
    value: number;
    icon: string;
    color: string;
}

//&  Mock data - Areas
const mockAreas = [
    {
        name: "GitHub",
        services: [<Icon name="github" size={24} color="#5A6ACF" />],
        status: "success",
        date: "2024-10-01",
        url: "https://example.com/test/github",
    },
    {
        name: "Google Drive",
        services: [<Icon name="google" size={24} color="#5A6ACF" />],
        status: "pending",
        date: "2024-09-30",
        url: "https://example.com/test/google-drive",
    },
    {
        name: "Discord",
        services: [<Icon name="discord" size={24} color="#5A6ACF" />],
        status: "failure",
        date: "2024-09-28",
        url: "https://example.com/test/discord",
    },
];
//&  Mock data - Metrics
const mockMetrics: Metric[] = [
    {
        label: "Completed Automations",
        value: 5,
        icon: "check-circle",
        color: "#4CAF50",
    },
    {
        label: "Pending Tasks",
        value: 3,
        icon: "hourglass-half",
        color: "#FFC107",
    },
    {
        label: "Failed Automations",
        value: 2,
        icon: "times-circle",
        color: "#F44336",
    },
    {
        label: "Total Automations",
        value: 10,
        icon: "bar-chart",
        color: "#5A6ACF",
    },
];

const { width: viewportWidth } = Dimensions.get("window");

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [areas, setAreas] = useState(mockAreas);
    const [metrics, setMetrics] = useState<Metric[]>(mockMetrics); // Specify Metric type here

    // Simulate data loading with a timeout
    useEffect(() => {
        const loadData = () => {
            setTimeout(() => {
                setAreas(mockAreas);
                setMetrics(mockMetrics);
                setLoading(false);
            }, 1000);
        };

        loadData();
    }, []);

    // Function to trigger the test area
    const testArea = (url: string) => {
        alert(`Test area executed for ${url}!`);
    };

    // Render the dashboard page
    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <View>
                <Text
                    variant="headlineLarge"
                    style={{
                        color: "#5A6ACF",
                        marginBottom: 20,
                        fontWeight: "bold",
                    }}
                >
                    Metrics Overview
                </Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#5A6ACF" />
                ) : (
                    <PagerView
                        style={{
                            height: 150,
                            width: viewportWidth,
                            alignContent: "center",
                        }}
                        initialPage={0}
                    >
                        {metrics.map((metric, index) => (
                            <View
                                key={index}
                                style={{
                                    alignContent: "center",
                                    width: viewportWidth,
                                }}
                            >
                                <Card
                                    style={{
                                        width: viewportWidth * 0.75,
                                        alignItems: "center",
                                        alignSelf: "center",
                                        padding: "auto",
                                    }}
                                >
                                    <Card.Content
                                        style={{
                                            alignItems: "center",
                                            alignContent: "center",
                                        }}
                                    >
                                        <Icon
                                            name={metric.icon}
                                            size={30}
                                            color={metric.color}
                                        />
                                        <Text
                                            variant="headlineMedium"
                                            style={{
                                                fontWeight: "bold",
                                                marginTop: 10,
                                            }}
                                        >
                                            {metric.value}
                                        </Text>
                                        <Text>{metric.label}</Text>
                                    </Card.Content>
                                </Card>
                            </View>
                        ))}
                    </PagerView>
                )}
            </View>
            <View>
                <Text
                    variant="headlineLarge"
                    style={{
                        color: "#5A6ACF",
                        marginBottom: 20,
                        fontWeight: "bold",
                    }}
                >
                    Recent Activities
                </Text>
                {/* //TODO: add Areas into flatlist */}
                {loading ? (
                    <ActivityIndicator size="large" color="#5A6ACF" />
                ) : (
                    <View>
                        {areas.length === 0 ? (
                            <Text>No activities found</Text>
                        ) : (
                            areas.map((activity, index) => (
                                <Card key={index} style={{ marginBottom: 15 }}>
                                    <Card.Title
                                        title={activity.name}
                                        subtitle={activity.date}
                                        left={(props) => (
                                            <Avatar.Icon
                                                {...props}
                                                icon={() =>
                                                    activity.services[0]
                                                }
                                                color="#FFF"
                                                style={{
                                                    backgroundColor: "#5A6ACF",
                                                }}
                                            />
                                        )}
                                    />
                                    <Card.Content>
                                        <Text variant="bodyMedium">
                                            {activity.url}
                                        </Text>
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button
                                            mode="outlined"
                                            onPress={() =>
                                                testArea(activity.url)
                                            }
                                            style={{ marginRight: 10 }}
                                        >
                                            Test Area
                                        </Button>
                                        <Button
                                            mode="contained-tonal"
                                            style={{
                                                backgroundColor:
                                                    activity.status ===
                                                    "success"
                                                        ? "#4CAF50"
                                                        : activity.status ===
                                                          "pending"
                                                        ? "#FFC107"
                                                        : "#F44336",
                                            }}
                                        >
                                            {activity.status}
                                        </Button>
                                    </Card.Actions>
                                </Card>
                            ))
                        )}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Dashboard;
