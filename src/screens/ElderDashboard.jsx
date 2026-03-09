import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { auth } from "../config/firebase";

const colors = {
  bg: "#0F172A",
  sidebar: "#0B1220",
  card: "#1E293B",
  border: "#334155",
  primary: "#3B82F6",
  text: "#F1F5F9",
  muted: "#94A3B8",
};

export default function ElderDashboard({ navigation }) {
  const { user } = useContext(AuthContext);

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
      } catch (err) {
        console.log("ELDER DASHBOARD ERROR:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const recent = requests
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>

        {/* Sidebar (Web Only) */}
        {Platform.OS === "web" && (
          <View style={styles.sidebar}>
            <View style={styles.profileSection}>
              <View style={styles.avatar} />
              <Text style={styles.profileName}>
                {user?.name}
              </Text>
              <Text style={styles.profileRole}>
                Elder
              </Text>
            </View>

            <SidebarItem label="Dashboard" active />
            <SidebarItem
              label="My Requests"
              onPress={() => navigation.navigate("MyRequests")}
            />
            
          </View>
        )}

        {/* Main Content */}
        <ScrollView style={styles.content}>
          <Text style={styles.heading}>
            Welcome back, {user?.name}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("CreateRequest", { type: "medicine" })}
            >
              <Text style={styles.primaryText}>
                Request Medicine Delivery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("CreateRequest", { type: "volunteer" })}
            >
              <Text style={styles.primaryText}>
                Request Volunteer Support
              </Text>
            </TouchableOpacity>
          </View>

          {/* Upload Medical Report */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Upload your latest medical report
            </Text>
            <Text style={styles.cardDesc}>
              Keep your health information up-to-date.
            </Text>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => navigation.navigate("UploadMedicalReport")}
            >
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          <Text style={styles.sectionTitle}>
            Recent Activity
          </Text>

          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : recent.length === 0 ? (
            <Text style={{ color: colors.muted }}>
              No recent activity.
            </Text>
          ) : (
            recent.map((item) => (
              <View key={item._id} style={styles.activityCard}>
                <Text style={styles.activityTitle}>
                  {item.type?.toUpperCase()}
                </Text>
                <Text style={styles.activityStatus}>
                  {item.status}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Chatbot Floating Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate("Chatbot")}
      >
        <Text style={{ fontSize: 20 }}>💬</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const SidebarItem = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[
      styles.sidebarItem,
      active && { backgroundColor: colors.card },
    ]}
    onPress={onPress}
  >
    <Text style={styles.sidebarText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  layout: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flex: 1,
  },

  sidebar: {
    width: 250,
    backgroundColor: colors.sidebar,
    padding: 20,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.border,
    marginBottom: 10,
  },

  profileName: {
    color: colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },

  profileRole: {
    color: colors.muted,
    fontSize: 13,
  },

  sidebarItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  sidebarText: {
    color: colors.text,
  },

  content: {
    flex: 1,
    padding: 30,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 30,
  },

  buttonRow: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: 20,
    marginBottom: 30,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  primaryText: {
    color: "#FFF",
    fontWeight: "600",
  },

  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 30,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  cardDesc: {
    color: colors.muted,
    marginBottom: 15,
  },

  uploadButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  uploadText: {
    color: "#FFF",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 15,
  },

  activityCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activityTitle: {
    color: colors.primary,
    fontWeight: "bold",
  },

  activityStatus: {
    color: colors.muted,
    marginTop: 4,
  },

  chatButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
});
