import { View, Text, FlatList, Button } from "react-native";
import { useState, useCallback } from "react";
import axios from "axios";
import { auth } from "../config/firebase";
import { useFocusEffect } from "@react-navigation/native";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = await auth.currentUser.getIdToken();

      const res = await axios.get(
        "https://elderbackend-production.up.railway.app/volunteer/tasks",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(res.data);
    } catch (err) {
      console.error("FETCH TASKS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const completeTask = async (id) => {
    try {
      const token = await auth.currentUser.getIdToken();

      await axios.post(
        `https://elderbackend-production.up.railway.app/volunteer/complete/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Task marked as completed");
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to mark task complete", err.message);
    }
  };

  if (loading) return <Text>Loading tasks...</Text>;

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={<Text>No tasks assigned</Text>}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>Elder: {item.elder?.name}</Text>
          <Text>Elder: {item.elder?.email}</Text>
          <Text>Type: {item.type}</Text>
          <Text>Description: {item.description}</Text>
          
          <Text>Status: {item.status}</Text>

          {item.status !== "completed" && (
            <Button
              title="Mark Completed"
              onPress={() => completeTask(item._id)}
            />
          )}
        </View>
      )}
    />
  );
}
