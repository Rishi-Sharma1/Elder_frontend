import { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import Greeting from "../components/Greeting";

export default function NGODashboard({ navigation }) {
  const user = useContext(AuthContext);

  const status = user?.verification?.status || "not_uploaded";

  const statusStyle =
    status === "approved"
      ? styles.approved
      : status === "rejected"
      ? styles.rejected
      : styles.pending;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.content}>
        <Greeting />

        {/* Verification Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Verification Status</Text>
          <Text style={[styles.cardValue, statusStyle]}>
            {status.replace("_", " ").toUpperCase()}
          </Text>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>NGO Management</Text>

        {/* Dashboard Stats */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("NGOStats")}
        >
          <Text style={styles.primaryText}>
            📊 Dashboard Statistics
          </Text>
        </TouchableOpacity>

        {/* All Requests */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("NGORequests")}
        >
          <Text style={styles.secondaryText}>
            📋 View All Requests
          </Text>
        </TouchableOpacity>

        {/* Volunteers */}
        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={() => navigation.navigate("NGOVolunteers")}
        >
          <Text style={styles.tertiaryText}>
            👥 Manage Volunteers
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
    marginBottom: 20,
    color: "#1E293B",
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
    marginBottom: 20,
  },

  secondaryText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },

  tertiaryButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
  },

  tertiaryText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
});
