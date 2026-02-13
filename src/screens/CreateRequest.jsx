import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { auth } from "../config/firebase";
import { Picker } from "@react-native-picker/picker";

export default function CreateRequest({ navigation }) {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!type || !description) {
      if (Platform.OS === "web") {
        alert("Please fill all fields");
      } else {
        Alert.alert("Error", "Please fill all fields");
      }
      return;
    }

    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();

      await axios.post(
        "https://elderbackend-production.up.railway.app/elder/request",
        {
          type: type.toLowerCase(),
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Platform.OS === "web") {
        alert("Request submitted successfully");
        navigation.goBack();
      } else {
        Alert.alert("Success", "Your request has been submitted successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      console.error("CREATE REQUEST ERROR:", err);

      if (Platform.OS === "web") {
        alert("Failed to submit request");
      } else {
        Alert.alert("Error", "Failed to submit request");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Create Help Request</Text>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Select Request Type</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={type}
              onValueChange={(itemValue) => setType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Type" value="" />
              <Picker.Item label="Medicine" value="medicine" />
              <Picker.Item label="Food" value="food" />
              <Picker.Item label="Emergency" value="emergency" />
            </Picker>
          </View>

          <Text style={styles.label}>Describe Your Need</Text>

          <TextInput
            placeholder="Explain what you need..."
            value={description}
            onChangeText={setDescription}
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            type === "emergency" && styles.emergencyButton,
          ]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>
              {type === "emergency"
                ? "🚨 Submit Emergency Request"
                : "Submit Request"}
            </Text>
          )}
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

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E293B",
  },

  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#334155",
  },

  pickerContainer: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    marginBottom: 20,
  },

  picker: {
    height: 55,
  },

  textArea: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlignVertical: "top",
    minHeight: 120,
    color: "#1E293B",
  },

  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  emergencyButton: {
    backgroundColor: "#DC2626",
  },

  submitText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
});
