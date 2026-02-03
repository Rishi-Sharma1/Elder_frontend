import { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Greeting from "../components/Greeting";

export default function NGODashboard({ navigation }) {
  const user = useContext(AuthContext)
  return (
    <View style={{ padding: 20 }}>
      <Greeting />

      <Text>
  Verification: {user.verification?.status || "Not Uploaded"}
</Text>


      <Button
        title="Dashboard Stats"
        onPress={() => navigation.navigate("NGOStats")}
      />

      <Button
        title="All Requests"
        onPress={() => navigation.navigate("NGORequests")}
      />

      <Button
        title="Volunteers"
        onPress={() => navigation.navigate("NGOVolunteers")}
      />
    </View>
  );
}
