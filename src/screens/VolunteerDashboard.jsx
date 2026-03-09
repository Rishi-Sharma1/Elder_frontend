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
  green: "#16A34A",
  text: "#F1F5F9",
  muted: "#94A3B8",
};

export default function VolunteerDashboard({ navigation }) {
  const user = useContext(AuthContext);

  const [available, setAvailable] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = await auth.currentUser.getIdToken();

        const availableRes = await axios.get(
          "https://elderbackend-production.up.railway.app/volunteer/requests",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const tasksRes = await axios.get(
          "https://elderbackend-production.up.railway.app/volunteer/tasks",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setAvailable(availableRes.data);

        const completedTasks = tasksRes.data
          .filter((t) => t.status?.toLowerCase() === "completed")
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        setCompleted(completedTasks);
      } catch (err) {
        console.log("DASHBOARD ERROR:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        {/* Sidebar (Web Only) */}
        {Platform.OS === "web" && (
          <View style={styles.sidebar}>
            <View style={styles.profileSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.profileName}>
                {user?.name || "Volunteer"}
              </Text>

              <Text style={styles.profileRole}>
                {user?.role?.toUpperCase() || "VOLUNTEER"}
              </Text>
            </View>

            <SidebarItem label="Dashboard" active />
            <SidebarItem
              label="Requests"
              onPress={() => navigation.navigate("AvailableRequests")}
            />
            <SidebarItem
              label="My Tasks"
              onPress={() => navigation.navigate("MyTasks")}
            />
          </View>
        )}

        {/* Main Content */}
        <ScrollView style={styles.content}>
          <Text style={styles.heading}>Dashboard</Text>
          <Text style={styles.subheading}>
            Manage your activities and performance
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              {/* Stats */}
              <View style={styles.statsRow}>
                <StatCard
                  title="Available Tasks"
                  value={available.length}
                  color={colors.primary}
                />
                <StatCard
                  title="Completed Tasks"
                  value={completed.length}
                  color={colors.green}
                />
              </View>

              {/* Quick Actions */}
              <SectionTitle title="Quick Actions" />

              {available.slice(0, 3).map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.quickCard}
                  onPress={() => navigation.navigate("AvailableRequests")}
                >
                  <Text style={styles.quickTitle}>
                    {item.type?.toUpperCase()}
                  </Text>
                  <Text style={styles.quickDesc}>{item.description}</Text>
                </TouchableOpacity>
              ))}

              {available.length === 0 && (
                <Text style={{ color: colors.muted }}>
                  No available requests.
                </Text>
              )}

              {/* Recent Activity */}
              <SectionTitle title="Recent Activity" />

              {completed.slice(0, 3).map((item) => (
                <View key={item._id} style={styles.activityCard}>
                  <Text style={styles.activityTitle}>
                    {item.type?.toUpperCase()}
                  </Text>
                  <Text style={styles.activityDesc}>{item.description}</Text>
                  <Text style={styles.activityStatus}>Completed</Text>
                </View>
              ))}

              {completed.length === 0 && (
                <Text style={{ color: colors.muted }}>
                  No completed tasks yet.
                </Text>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const SidebarItem = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.sidebarItem, active && { backgroundColor: colors.card }]}
    onPress={onPress}
  >
    <Text style={styles.sidebarText}>{label}</Text>
  </TouchableOpacity>
);

const StatCard = ({ title, value, color }) => (
  <View style={[styles.statCard, { borderColor: color }]}>
    <Text style={styles.statNumber}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const SectionTitle = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

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
    marginBottom: 30,
    alignItems: "center",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border,
    marginBottom: 10,
  },

  profileName: {
    color: colors.text,
    fontWeight: "bold",
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
    padding: 24,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },

  subheading: {
    color: colors.muted,
    marginBottom: 30,
  },

  statsRow: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: 20,
    marginBottom: 30,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.text,
  },

  statTitle: {
    marginTop: 8,
    color: colors.muted,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 15,
  },

  quickCard: {
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  quickTitle: {
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 5,
  },

  quickDesc: {
    color: colors.muted,
  },

  activityCard: {
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activityTitle: {
    color: colors.green,
    fontWeight: "bold",
    marginBottom: 5,
  },

  activityDesc: {
    color: colors.muted,
  },

  activityStatus: {
    marginTop: 6,
    color: colors.green,
    fontSize: 12,
  },
});
