import { useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();

      const res = await axios.get(
        "https://elderbackend-production.up.railway.app/volunteer/tasks",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(res.data);
    } catch (err) {
      console.error("FETCH TASKS ERROR:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const completeTask = async (id) => {
    try {
      setProcessingId(id);
      const token = await auth.currentUser.getIdToken();

      await axios.post(
        `https://elderbackend-production.up.railway.app/volunteer/complete/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Task marked as completed");

      setTasks(
        tasks.map((t) =>
          t._id === id ? { ...t, status: "completed" } : t
        )
      );
    } catch (err) {
      Alert.alert("Error", "Failed to mark task complete");
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

  if (tasks.length === 0) {
    return (
      <Safe style={styles.center}>
        <Text style={styles.emptyText}>
          No tasks assigned yet.
        </Text>
      </Safe>
    );
  }

  return (
    <Safe style={styles.container}>
      <FlatList
        data={tasks}
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
                👤 {item.elder?.name || "N/A"}
              </Text>

              <Text style={styles.info}>
                📧 {item.elder?.email || "N/A"}
              </Text>

              <Text style={[styles.status, statusStyle]}>
                Status: {item.status}
              </Text>

              {item.status !== "completed" && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => completeTask(item._id)}
                  disabled={processingId === item._id}
                >
                  {processingId === item._id ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.completeText}>
                      Mark as Completed
                    </Text>
                  )}
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
    marginBottom: 6,
    color: "#334155",
  },

  status: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
  },

  completed: {
    color: "#16A34A",
  },

  assigned: {
    color: "#2563EB",
  },

  pending: {
    color: "#F59E0B",
  },

  completeButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },

  completeText: {
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
