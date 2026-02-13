import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { SafeAreaView as Safe } from "react-native-safe-area-context";
import axios from "axios";
import { auth } from "../config/firebase";

export default function AvailableRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(
          "https://elderbackend-production.up.railway.app/volunteer/requests",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(res.data);
      } catch (err) {
        console.error("FETCH REQUESTS ERROR:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const acceptRequest = async (id) => {
    try {
      setProcessingId(id);
      const token = await auth.currentUser.getIdToken();

      await axios.post(
        `https://elderbackend-production.up.railway.app/volunteer/accept/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Request accepted!");
      setRequests(requests.filter((r) => r._id !== id));
    } catch (err) {
      console.error("ACCEPT ERROR:", err.response?.data || err);
      Alert.alert("Error", "Failed to accept request");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Safe style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </Safe>
    );
  }

  if (requests.length === 0) {
    return (
      <Safe style={styles.center}>
        <Text style={styles.emptyText}>
          No available requests right now.
        </Text>
      </Safe>
    );
  }

  return (
    <Safe style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.type}>
              {item.type.toUpperCase()}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>

            <Text style={styles.info}>
              👤 {item.elder?.name || item.elder?.email || "N/A"}
            </Text>

            <Text style={styles.info}>
              📞 {item.elder?.phone || "N/A"}
            </Text>

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => acceptRequest(item._id)}
              disabled={processingId === item._id}
            >
              {processingId === item._id ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.acceptText}>
                  Accept Request
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </Safe>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 5,
  },

  type: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1E293B",
  },

  description: {
    fontSize: 18,
    marginBottom: 10,
    color: "#475569",
  },

  info: {
    fontSize: 16,
    marginBottom: 6,
    color: "#334155",
  },

  acceptButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },

  acceptText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },

  emptyText: {
    fontSize: 20,
    color: "#64748B",
  },
});
