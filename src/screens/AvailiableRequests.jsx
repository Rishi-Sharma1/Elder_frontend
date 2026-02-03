import { View, Text, FlatList, Button } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../config/firebase";

export default function AvailableRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(
          "https://elderbackend-production.up.railway.app/volunteer/requests",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(res.data);
      } catch (err) {
        console.error("FETCH REQUESTS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const acceptRequest = async (id) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `https://elderbackend-production.up.railway.app/volunteer/accept/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Request accepted!");
      setRequests(requests.filter((r) => r._id !== id));
    } catch (err) {
      console.error("ACCEPT ERROR:", err);
      alert("Failed to accept request");
    }
  };

  if (loading) return <Text>Loading requests...</Text>;

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={<Text>No requests available</Text>}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>Type: {item.type}</Text>
          <Text>Description: {item.description}</Text>
          <Text>
            Elder: {item.elder?.name || item.elder?.email || "N/A"}
          </Text>
          <Text>Phone: {item.elder?.phone || "N/A"}</Text>
          <Button title="Accept" onPress={() => acceptRequest(item._id)} />
        </View>
      )}
    />
  );
}
