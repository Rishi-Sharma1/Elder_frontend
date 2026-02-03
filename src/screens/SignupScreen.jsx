import { View, TextInput, Button, Text, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SignupScreen({ route }) {

  const { role } = route.params;

  const { login } = useContext(AuthContext); // 🔥 IMPORTANT

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signup = async () => {
    try {

      if (!name || !email || !password || !confirmPassword) {
        Alert.alert("Error", "All fields are required");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      // Create Firebase user
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get token
      const token = await res.user.getIdToken(true);

      // Register in backend
      const backendRes = await axios.post(
        "https://elderbackend-production.up.railway.app/auth/register",
        {
          token,
          role,
          name,
        }
      );

      // Refresh firebase user
      await res.user.reload();

      // 🔥 AUTO LOGIN (THIS FIXES REDIRECT)
      login(backendRes.data.user);

    } catch (err) {

      console.log("SIGNUP ERROR:", err);

      if (err.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Email already registered");
      } else {
        Alert.alert("Error", "Signup failed. Try again.");
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>

      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        {role === "ngo" ? "Organization Name" : "Full Name"}
      </Text>

      <TextInput
        placeholder={role === "ngo" ? "Organization Name" : "Full Name"}
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
        }}
      />

      <Button title="Signup" onPress={signup} />

    </View>
  );
}


//https://elderbackend-production.up.railway.app
//https://elderbackend-production.up.railway.app