import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { SafeAreaView as Safe } from "react-native-safe-area-context";

export default function RoleSelectScreen({ navigation }) {
  const selectRole = (role) => {
    navigation.navigate("Signup", { role });
  };

  return (
    <Safe style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>
          Select how you want to use Elder Connect
        </Text>

        {/* Elder */}
        <TouchableOpacity
          style={[styles.card, styles.elder]}
          onPress={() => selectRole("elder")}
        >
          <Text style={styles.cardTitle}>🧓 Elder</Text>
          <Text style={styles.cardText}>
            Request help, food, or medical assistance
          </Text>
        </TouchableOpacity>

        {/* Volunteer */}
        <TouchableOpacity
          style={[styles.card, styles.volunteer]}
          onPress={() => selectRole("volunteer")}
        >
          <Text style={styles.cardTitle}>🤝 Volunteer</Text>
          <Text style={styles.cardText}>
            Help elders and support your community
          </Text>
        </TouchableOpacity>

        {/* NGO */}
        <TouchableOpacity
          style={[styles.card, styles.ngo]}
          onPress={() => selectRole("ngo")}
        >
          <Text style={styles.cardTitle}>🏢 NGO</Text>
          <Text style={styles.cardText}>
            Manage requests and coordinate support
          </Text>
        </TouchableOpacity>
      </View>
    </Safe>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#1E293B",
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    color: "#64748B",
  },

  card: {
    padding: 24,
    borderRadius: 18,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 18,
    opacity: 0.9,
  },

  elder: {
    backgroundColor: "#DBEAFE", // soft blue
  },

  volunteer: {
    backgroundColor: "#DCFCE7", // soft green
  },

  ngo: {
    backgroundColor: "#FEF3C7", // soft yellow
  },
});
