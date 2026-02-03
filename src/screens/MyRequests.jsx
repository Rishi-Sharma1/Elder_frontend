import { View, Text, FlatList } from "react-native";
import axios from "axios";
import { auth } from "../config/firebase";
import { useEffect, useState } from "react";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get(
        "https://elderbackend-production.up.railway.app/elder/requests",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data);
    };

    fetchRequests();
  }, []);

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>{item.type.toUpperCase()}</Text>
          <Text>{item.description}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
    />
  );
}
