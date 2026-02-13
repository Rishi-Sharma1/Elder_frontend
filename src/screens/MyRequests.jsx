import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView as Safe } from "react-native-safe-area-context";
import axios from "axios";
import { auth } from "../config/firebase";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(
          "https://elderbackend-production.up.railway.app/elder/requests",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(res.data);
      } catch (error) {
        console.log("FETCH REQUEST ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const renderItem = ({ item }) => {
    const statusColor =
      item.status === "approved"
        ? styles.approved
        : item.status === "rejected"
        ? styles.rejected
        : styles.pending;

    return (
      <View style={styles.card}>
        <Text style={styles.type}>
          {item.type.toUpperCase()}
        </Text>

        <Text style={styles.description}>
          {item.description}
        </Text>

        <Text style={[styles.status, statusColor]}>
          Status: {item.status}
        </Text>
      </View>
    );
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
          No requests submitted yet.
        </Text>
      </Safe>
    );
  }

  return (
    <Safe style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
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
    borderRadius: 16,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
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

  status: {
    fontSize: 16,
    fontWeight: "600",
  },

  approved: {
    color: "#16A34A",
  },

  rejected: {
    color: "#DC2626",
  },

  pending: {
    color: "#F59E0B",
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
