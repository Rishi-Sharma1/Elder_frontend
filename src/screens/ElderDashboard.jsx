import { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Greeting from "../components/Greeting";

export default function ElderDashboard({ navigation }) {

  const user = useContext(AuthContext);
  return (
    <View style={{ padding: 20 }}>
      <Greeting />
      
      <Text>
  Verification: {user.verification?.status || "Not Uploaded"}
</Text>

      <Button
        title="Request Help / Medicine"
        onPress={() => navigation.navigate("CreateRequest")}
      />

      <Button
        title="My Requests"
        onPress={() => navigation.navigate("MyRequests")}
      />
    </View>
  );
}
