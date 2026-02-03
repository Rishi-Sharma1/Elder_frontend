import { View, TextInput, Button, Alert, Platform } from "react-native";
import { useState } from "react";
import axios from "axios";
import { auth } from "../config/firebase";
import { Picker } from "@react-native-picker/picker";



export default function CreateRequest({ navigation }) {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  // const submit = async () => {
  //   try {
  //     const token = await auth.currentUser.getIdToken();

  //     await axios.post(
  //       "https://elderbackend-production.up.railway.app/elder/request",
  //       {
  //         type: type.toLowerCase(),   // IMPORTANT
  //         description,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     navigation.goBack();
  //   } catch (err) {
  //     console.error("❌ CREATE REQUEST ERROR:", err.response?.data || err);
  //   }
  // };

  const submit = async () => {
    if (!type || !description) {
      if (Platform.OS === "web") {
        alert("Please fill all fields");
      } else {
        Alert.alert("Error", "Please fill all fields");
      }
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();

      await axios.post(
        "https://elderbackend-production.up.railway.app/elder/request",
        {
          type: type.toLowerCase(),
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ✅ SUCCESS MESSAGE
      if (Platform.OS === "web") {
        alert("Request submitted successfully");
        navigation.goBack();
      } else {
        Alert.alert("Success", "Your request has been submitted successfully", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (err) {
      console.error("❌ CREATE REQUEST ERROR:", err);

      if (Platform.OS === "web") {
        alert("Failed to submit request");
      } else {
        Alert.alert("Error", "Failed to submit request");
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={{ borderWidth: 1, marginBottom: 10 }}
      >
        <Picker.Item label="Select Type" value="" />

        <Picker.Item label="Medicine" value="medicine" />
        <Picker.Item label="Food" value="food" />
        <Picker.Item label="Emergency" value="emergency" />
      </Picker>

      <TextInput
        placeholder="Describe your need"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Submit Request" onPress={submit} />
    </View>
  );
}

