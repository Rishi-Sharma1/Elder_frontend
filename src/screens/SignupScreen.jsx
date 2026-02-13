import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function SignupScreen({ route }) {
  const { role } = route.params;
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
  if (!name || !email || !password || !confirmPassword) {
    Alert.alert("Error", "All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const res = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const token = await res.user.getIdToken(true);

    await axios.post(
      "https://elderbackend-production.up.railway.app/auth/register",
      {
        token,
        role,
        name,
      }
    );

    // 🔥 SUCCESS MESSAGE + REDIRECT TO LOGIN
    Alert.alert(
      "Registration Successful 🎉",
      "Your account has been created successfully. Please login to continue.",
      [
        {
          text: "OK",
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          }),
        },
      ]
    );

  } catch (err) {
    console.log("FULL BACKEND ERROR:", err.response?.data || err);
    Alert.alert("Signup Failed", "Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>
            {role === "ngo" ? "Register Organization" : "Create Account"}
          </Text>

          <Text style={styles.subtitle}>
            {role === "ngo"
              ? "Register your organization with Elder Connect"
              : "Join Elder Connect today"}
          </Text>

          <View style={styles.card}>
            <TextInput
              placeholder={role === "ngo" ? "Organization Name" : "Full Name"}
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />

            <TextInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />

            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />

            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={signup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.signupText}>Signup</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: "center",
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
    marginBottom: 30,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 18,
    marginBottom: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  input: {
    backgroundColor: "#F1F5F9",
    padding: 18,
    borderRadius: 14,
    fontSize: 18,
    marginBottom: 20,
    color: "#1E293B",
  },

  signupButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
  },

  signupText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
});
