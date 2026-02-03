import { View, Text, FlatList, Button } from "react-native";
import { useState, useCallback } from "react";
import axios from "axios";
import { auth } from "../config/firebase";
import { useFocusEffect } from "@react-navigation/native";

export default function NGORequests({ navigation }) {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get(
        "https://elderbackend-production.up.railway.app/ngo/requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data);
    } catch (err) {
      console.error("FETCH NGO REQUESTS ERROR:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>Type: {item.type}</Text>
          <Text>Elder: {item.elder?.name || item.elder?.email || "N/A"}</Text>
          <Text>Description: {item.description}</Text>
          <Text>Status: {item.status}</Text>

          {item.status === "pending" && (
            <Button
              title="Assign Volunteer"
              onPress={() =>
                navigation.navigate("AssignVolunteer", {
                  requestId: item._id,
                })
              }
            />
          )}
        </View>
      )}
    />
  );
}
