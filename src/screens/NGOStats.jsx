import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../config/firebase";

export default function NGOStats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get(
        "https://elderbackend-production.up.railway.app/ngo/stats",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(res.data);
    };

    fetchStats();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Elders: {stats.elders}</Text>
      <Text>Volunteers: {stats.volunteers}</Text>
      <Text>Requests: {stats.requests}</Text>
    </View>
  );
}
