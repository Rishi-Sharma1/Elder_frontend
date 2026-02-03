import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../config/firebase";

export default function NGOVolunteers() {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get(
        "https://elderbackend-production.up.railway.app/ngo/volunteers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVolunteers(res.data);
    };

    fetchVolunteers();
  }, []);

  return (
    <FlatList
      data={volunteers}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 16 }}>{item.email}</Text>
          <Text>Role: Volunteer</Text>
        </View>
      )}
    />
  );
}
