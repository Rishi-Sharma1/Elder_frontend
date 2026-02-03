import { View, TextInput, Button } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useState } from "react";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ✅ NO navigation here
      // AuthContext will handle redirect automatically
    } catch (error) {
      alert("Wrong email or password");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={login} />

      <Button
        title="Signup"
        onPress={() => navigation.navigate("RoleSelect")}
      />
    </View>
  );
}
