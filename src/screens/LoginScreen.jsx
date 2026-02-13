import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Wrong email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        {/* App Title */}
        <Text style={styles.title}>Elder Connect</Text>
        <Text style={styles.subtitle}>
          Helping elders with care & support
        </Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#94A3B8"
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#94A3B8"
        />

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={login}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Signup Button */}
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate("RoleSelect")}
        >
          <Text style={styles.signupText}>
            Create New Account
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
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

  input: {
    backgroundColor: "#F1F5F9",
    padding: 18,
    borderRadius: 14,
    fontSize: 18,
    marginBottom: 20,
    color: "#1E293B",
  },

  loginButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
  },

  loginText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },

  signupButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  signupText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
});
