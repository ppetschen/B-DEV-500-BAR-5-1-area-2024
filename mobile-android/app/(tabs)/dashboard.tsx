import React, { useEffect, useState } from "react";
import {
    View,
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
} from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import PagerView from "react-native-pager-view";
import { useRouter } from "expo-router";
import {
    areaInList,
    getListAreas,
    responseAreaInList,
} from "@/services/area-composition";
import AreaInListCard from "@components/AreaInListCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const iconMapping: Record<string, string> = {
    github: "github",
    google: "google",
    discord: "discord",
};

interface Metric {
    label: string;
    value: number;
    icon: string;
    color: string;
}

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
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [areas, setAreas] = useState<areaInList[]>([]);
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [completedCount, setCompletedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [failedCount, setFailedCount] = useState(0);

    //*[IconMap[area.service_name as keyof typeof IconMap]]
    // Simulate data loading with a timeout
    useEffect(() => {
        const loadData = () => {
            setTimeout(async () => {
                console.log("Areas:", areas);
                const fetchedAreas: Array<areaInList> | null =
                    await getListAreas().then(async (areas) =>
                        areas
                            ? await Promise.all(
                                  areas.map(async (area) => ({
                                      name: area.service_name,
                                      //TODO: CLEANUP
                                      services: [
                                          <Icon
                                              name={
                                                  iconMapping[
                                                      area.service_name.toLowerCase()
                                                  ] || "question-circle"
                                              }
                                              size={24}
                                              color="#5A6ACF"
                                          />,
                                      ],
                                      status: area.event_type,
                                      date: area.created_at,
                                      url: `${await AsyncStorage.getItem(
                                          "api_base_url"
                                      )}/area-composition/execute?id=${
                                          area.id
                                      }`,
                                  }))
                              )
                            : []
                    );
                setAreas(fetchedAreas || []);
                if (areas !== null) {
                    setCompletedCount(
                        areas.filter((area) => area.status === "success").length
                    );
                    setPendingCount(
                        areas.filter((area) => area.status === "pending").length
                    );
                    setFailedCount(
                        areas.filter((area) => area.status === "failure").length
                    );
                } else {
                    setCompletedCount(0);
                    setPendingCount(0);
                    setFailedCount(0);
                }
                setMetrics([
                    {
                        label: "Completed Automations",
                        value: completedCount,
                        icon: "check-circle",
                        color: "#4CAF50",
                    },
                    {
                        label: "Pending Tasks",
                        value: pendingCount,
                        icon: "hourglass-half",
                        color: "#FFC107",
                    },
                    {
                        label: "Failed Automations",
                        value: failedCount,
                        icon: "times-circle",
                        color: "#F44336",
                    },
                    {
                        label: "Total Automations",
                        value: (fetchedAreas || []).length,
                        icon: "bar-chart",
                        color: "#5A6ACF",
                    },
                ]);
                setLoading(false);
            }, 1000);
        };

        loadData();
    }, []);

    // Function to trigger the test area
    const testArea = (url: string) => {
        alert(`Test area executed for ${url}!`);
    };

    const handleAddWorkflow = () => {
        router.push("/new-workflow");
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

                {loading ? (
                    <ActivityIndicator size="large" color="#5A6ACF" />
                ) : (
                    <View>
                        {areas.length === 0 ? (
                            <Text>No activities found</Text>
                        ) : (
                            areas.map((activity, index) =>
                                AreaInListCard(
                                    {
                                        name: activity.name,
                                        date: activity.date,
                                        url: activity.url,
                                        services: activity.services,
                                        status: activity.status,
                                        onTest: testArea,
                                    },
                                    index.toString()
                                )
                            )
                        )}
                    </View>
                )}
            </View>
            <IconButton
                icon="plus"
                iconColor="#18345E"
                size={40}
                onPress={handleAddWorkflow}
                style={{
                    backgroundColor: "#A4B3FF",
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    zIndex: 1000,
                }}
            />
        </SafeAreaView>
    );
};

export default Dashboard;
