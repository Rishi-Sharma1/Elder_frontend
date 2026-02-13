import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { SafeAreaView as Safe } from "react-native-safe-area-context";
import axios from "axios";
import { auth } from "../config/firebase";

export default function NGOVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const token = await auth.currentUser.getIdToken();

        const res = await axios.get(
          "https://elderbackend-production.up.railway.app/ngo/volunteers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setVolunteers(res.data);
      } catch (err) {
        console.error("FETCH NGO VOLUNTEERS ERROR:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  if (loading) {
    return (
      <Safe style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </Safe>
    );
  }

  if (volunteers.length === 0) {
    return (
      <Safe style={styles.center}>
        <Text style={styles.emptyText}>
          No volunteers registered.
        </Text>
      </Safe>
    );
  }

  return (
    <Safe style={styles.container}>
      <FlatList
        data={volunteers}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => {
          const status = item.verification?.status || "not_uploaded";

          const statusStyle =
            status === "approved"
              ? styles.approved
              : status === "rejected"
              ? styles.rejected
              : styles.pending;

          return (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.name || "Volunteer"}
              </Text>

              <Text style={styles.email}>
                {item.email}
              </Text>

              <Text style={[styles.status, statusStyle]}>
                Verification: {status.replace("_", " ").toUpperCase()}
              </Text>
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

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1E293B",
  },

  email: {
    fontSize: 16,
    marginBottom: 8,
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
