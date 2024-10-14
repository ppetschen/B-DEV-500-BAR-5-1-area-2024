import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import { AreaElement, listAreas } from "@/utils/client";

type Connection = {
  id: string;
  name: string;
  description: string;
  connection: { from: string; to: string };
  lastRun: string;
  createdAt: string;
};

export default function DashboardScreen() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const areas: AreaElement[] = await listAreas();

        const formattedConnections: Connection[] = areas.map((area) => ({
          id: area.id,
          name: area.service_name,
          description: area.event_type,
          connection: { from: area.owner_id.toString(), to: area.service_name },
          lastRun: area.created_at,
          createdAt: area.created_at,
        }));
        setConnections(formattedConnections);
      } catch (err) {
        setError("Failed to load connections.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const deleteConnection = (index: number) => {
    Alert.alert(
      "Delete Connection",
      "Are you sure you want to delete this connection?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setConnections(connections.filter((_, i) => i !== index));
          },
        },
      ],
    );
  };

  const handleCreateAction = () => {
    Alert.alert("Create Action", "This is where you can create a new action!");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading connections...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Manage your connections below</Text>
        </View>

        {connections.map((connection, index) => (
          <View key={index} style={styles.connectionCard}>
            <View style={styles.connectionInfo}>
              <Text style={styles.connectionTitle}>{connection.name}</Text>
              <Text style={styles.connectionDescription}>
                {connection.description.length > 50
                  ? connection.description.substring(0, 47) + "..."
                  : connection.description}
              </Text>
              <Text style={styles.metadata}>
                {`From: ${connection.connection.from}  |  To: ${connection.connection.to}`}
              </Text>
              <Text style={styles.metadata}>
                {`Last Run: ${connection.lastRun}  |  Created: ${connection.createdAt}`}
              </Text>
              <Text style={styles.metadata}>
                {`${
                  process.env["API_BASE_URL"] ?? "http://localhost:8000"
                }/area-composition/execute?id=${connection.id}`}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                deleteConnection(index)}
              style={styles.deleteIcon}
            >
              <Text style={styles.cross}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#00000000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    alignSelf: "flex-start",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  connectionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  connectionInfo: {
    flex: 1,
  },
  connectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  connectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  metadata: {
    fontSize: 12,
    color: "#888",
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  cross: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: "gray",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});
