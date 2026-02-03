import { View, Text, FlatList, Button } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../config/firebase";

export default function AssignVolunteer({ route, navigation }) {
  const requestId = route?.params?.requestId;   // ✅ FIXED
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(
          "https://elderbackend-production.up.railway.app/ngo/volunteers",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("VOLUNTEERS:", res.data); // debug
        setVolunteers(res.data);
      } catch (err) {
        console.error("FETCH VOLUNTEERS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const assign = async (volunteerId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        "https://elderbackend-production.up.railway.app/ngo/assign",
        { requestId, volunteerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Volunteer assigned successfully");
      navigation.goBack();
    } catch (err) {
      console.error("ASSIGN ERROR:", err);
      alert("Failed to assign volunteer");
    }
  };

  if (loading) return <Text>Loading volunteers...</Text>;

  return (
    <FlatList
      data={volunteers}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={<Text>No volunteers found</Text>}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>{item.email}</Text> {/* ✅ FIXED */}
          <Button title="Assign" onPress={() => assign(item._id)} />
        </View>
      )}
    />
  );
}
