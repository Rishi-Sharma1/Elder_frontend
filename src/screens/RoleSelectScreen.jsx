import { View, Text, Pressable } from "react-native";

export default function RoleSelectScreen({ navigation }) {
  const selectRole = (role) => {
    navigation.navigate("Signup", { role });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: 20, padding: 30 }}>
      <Text style={{ fontSize: 24, textAlign: "center" }}>Select Role</Text>

      <Pressable onPress={() => selectRole("elder")}>
        <Text>Elder</Text>
      </Pressable>

      <Pressable onPress={() => selectRole("volunteer")}>
        <Text>Volunteer</Text>
      </Pressable>

      <Pressable onPress={() => selectRole("ngo")}>
        <Text>NGO</Text>
      </Pressable>
    </View>
  );
}
