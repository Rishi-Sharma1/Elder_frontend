import { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import Greeting from "../components/Greeting";

export default function ElderDashboard({ navigation }) {
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

        {/* Primary Action */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("CreateRequest")}
        >
          <Text style={styles.primaryButtonText}>
            Request Help / Medicine
          </Text>
        </TouchableOpacity>

        {/* My Requests */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("MyRequests")}
        >
          <Text style={styles.secondaryButtonText}>
            View My Requests
          </Text>
        </TouchableOpacity>

        {/* Emergency Quick Action */}
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() =>
            navigation.navigate("CreateRequest", { type: "emergency" })
          }
        >
          <Text style={styles.emergencyText}>
            🚨 Emergency Request
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
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    marginTop: 20,
    marginBottom: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
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

  approved: {
    color: "#16A34A",
  },

  rejected: {
    color: "#DC2626",
  },

  pending: {
    color: "#F59E0B",
  },

  primaryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },

  primaryButtonText: {
    color: "#FFFFFF",
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

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },

  emergencyButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 22,
    borderRadius: 18,
    alignItems: "center",
  },

  emergencyText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
});
