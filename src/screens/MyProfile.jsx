import { View, Text, TextInput, Button, Image } from "react-native";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";

export default function MyProfile() {

  const { user, login, logout, loading } = useContext(AuthContext);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const [idImage, setIdImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
  if (!user && !loading) {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }
}, [user, loading]);

  // 🔥 Sync when user loads
  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setGender(user.gender || "");
      setEmergencyContact(user.emergencyContact || "");
    }
  }, [user]);

  // ✅ Prevent crash
  if (loading) return null;
  if (!user) return null;

  // Pick Image
  const pickImage = async () => {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required!");
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

    if (!result.canceled) {
      setIdImage(result.assets[0].uri);
    }
  };

  // Upload to Cloudinary
  const uploadImage = async () => {

    if (!idImage) return null;

    const data = new FormData();

    data.append("file", {
      uri: idImage,
      type: "image/jpeg",
      name: "id.jpg",
    });

    data.append("upload_preset", "elder_verify");
    data.append("cloud_name", "rishisharma");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/rishisharma/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();

    return json.secure_url;
  };

  // Save Profile
  const saveProfile = async () => {
    try {

      setUploading(true);

      const token = await auth.currentUser.getIdToken(true);

      let imageUrl = null;

      if (idImage) {
        imageUrl = await uploadImage();
      }

      const res = await axios.put(
        "https://elderbackend-production.up.railway.app/auth/update-profile",
        {
          phone,
          address,
          gender,
          emergencyContact,
          idFrontUrl: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated");

      // 🔥 Update context
      login(res.data);

    } catch (err) {

      console.log("PROFILE ERROR:", err);
      alert("Failed to update profile");

    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>

      {/* Info */}
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>Role: {user?.role}</Text>

      {/* Inputs */}
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={{ borderWidth: 1, marginVertical: 5, padding: 8 }}
      />

      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={{ borderWidth: 1, marginVertical: 5, padding: 8 }}
      />

      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={{ borderWidth: 1, marginVertical: 5, padding: 8 }}
      />

      {user?.role === "elder" && (
        <TextInput
          placeholder="Emergency Contact"
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          style={{ borderWidth: 1, marginVertical: 5, padding: 8 }}
        />
      )}

      {/* Upload */}
      <Button title="Upload Government ID" onPress={pickImage} />

      {idImage && (
        <Image
          source={{ uri: idImage }}
          style={{
            width: "100%",
            height: 200,
            marginTop: 10,
            borderRadius: 8,
          }}
        />
      )}

      {/* Save */}
      <View style={{ marginVertical: 15 }}>
        <Button
          title={uploading ? "Submitting..." : "Save Profile"}
          onPress={saveProfile}
          disabled={uploading}
        />
      </View>

      {/* Status */}
      <View style={{ marginTop: 20 }}>
        <Text>
          Verification Status:{" "}
          {user?.verification?.status || "not_uploaded"}
        </Text>

        {user?.verification?.status === "rejected" && (
          <Text style={{ color: "red" }}>
            Reason: {user?.verification?.rejectionReason}
          </Text>
        )}
      </View>

    </View>
  );
}
