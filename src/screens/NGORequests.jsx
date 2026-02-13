import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { SafeAreaView as Safe } from "react-native-safe-area-context";
import axios from "axios";
import { auth } from "../config/firebase";
import { useFocusEffect } from "@react-navigation/native";

export default function NGORequests({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const token = await auth.currentUser.getIdToken();

      const res = await axios.get(
        "https://elderbackend-production.up.railway.app/ngo/requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests(res.data);
    } catch (err) {
      console.error("FETCH NGO REQUESTS ERROR:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

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
          No requests available.
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
        renderItem={({ item }) => {
          const statusStyle =
            item.status === "completed"
              ? styles.completed
              : item.status === "assigned"
              ? styles.assigned
              : styles.pending;

          return (
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

              <Text style={[styles.status, statusStyle]}>
                Status: {item.status.toUpperCase()}
              </Text>

              {item.status === "pending" && (
                <TouchableOpacity
                  style={styles.assignButton}
                  onPress={() =>
                    navigation.navigate("AssignVolunteer", {
                      requestId: item._id,
                    })
                  }
                >
                  <Text style={styles.assignText}>
                    Assign Volunteer
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
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
    marginBottom: 8,
    color: "#334155",
  },

  status: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  pending: {
    color: "#F59E0B",
  },

  assigned: {
    color: "#2563EB",
  },

  completed: {
    color: "#16A34A",
  },

  assignButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  assignText: {
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
