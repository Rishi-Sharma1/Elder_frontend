import { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Greeting from "../components/Greeting";

export default function VolunteerDashboard({ navigation }) {

  const user=useContext(AuthContext)
  return (
    <View style={{ padding: 20 }}>
      <Greeting />

      <Text>
  Verification: {user.verification?.status || "Not Uploaded"}
</Text>


      <Button
        title="Available Requests"
        onPress={() => navigation.navigate("AvailableRequests")}
      />

      <Button
        title="My Tasks"
        onPress={() => navigation.navigate("MyTasks")}
      />
    </View>
  );
}
