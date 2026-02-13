import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import Greeting from "../components/Greeting";
import axios from "axios";
import { auth } from "../config/firebase";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


export default function VolunteerDashboard({ navigation }) {
  const user = useContext(AuthContext);

  const [availableCount, setAvailableCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const status = user?.verification?.status || "not_uploaded";

  const statusStyle =
    status === "approved"
      ? styles.approved
      : status === "rejected"
      ? styles.rejected
      : styles.pending;

  useFocusEffect(
  useCallback(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const token = await auth.currentUser.getIdToken();

        const availableRes = await axios.get(
          "https://elderbackend-production.up.railway.app/volunteer/requests",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const myTasksRes = await axios.get(
          "https://elderbackend-production.up.railway.app/volunteer/tasks",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAvailableCount(availableRes.data.length);

        const completed = myTasksRes.data.filter(
          (task) => task.status?.toLowerCase() === "completed"
        );

        setCompletedCount(completed.length);

      } catch (err) {
        console.log("DASHBOARD STATS ERROR:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [])
);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.content}>
        <Greeting />

        {/* Verification */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Verification Status</Text>
          <Text style={[styles.cardValue, statusStyle]}>
            {status.replace("_", " ").toUpperCase()}
          </Text>
        </View>

        {/* Stats Section */}
        <Text style={styles.sectionTitle}>Dashboard Overview</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {availableCount}
              </Text>
              <Text style={styles.statLabel}>
                Available Tasks
              </Text>
            </View>

            <View style={[styles.statCard, styles.completedCard]}>
              <Text style={styles.statNumber}>
                {completedCount}
              </Text>
              <Text style={styles.statLabel}>
                Completed Tasks
              </Text>
            </View>
          </View>
        )}

        {/* Navigation Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("AvailableRequests")}
        >
          <Text style={styles.primaryText}>
            📋 View Available Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("MyTasks")}
        >
          <Text style={styles.secondaryText}>
            ✅ My Tasks
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 24,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 22,
    borderRadius: 18,
    marginTop: 20,
    marginBottom: 25,
    elevation: 5,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 10,
  },

  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
  },

  approved: { color: "#16A34A" },
  rejected: { color: "#DC2626" },
  pending: { color: "#F59E0B" },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1E293B",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  statCard: {
    backgroundColor: "#DBEAFE",
    flex: 0.48,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },

  completedCard: {
    backgroundColor: "#DCFCE7",
  },

  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E293B",
  },

  statLabel: {
    fontSize: 16,
    marginTop: 6,
    color: "#334155",
  },

  primaryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },

  primaryText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },

  secondaryButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
  },

  secondaryText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
});
