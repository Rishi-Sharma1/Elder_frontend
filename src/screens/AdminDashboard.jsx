import { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard({ navigation }) {

  const user = useContext(AuthContext);
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Welcome, {user.name}</Text>
      <Text>
  Verification: {user.verification?.status || "Not Uploaded"}
</Text>

      <Button
        title="Manage Users"
        onPress={() => navigation.navigate("ManageUsers")}
      />
    </View>
  );
}
