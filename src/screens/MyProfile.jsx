import { View, Text, TextInput, Button, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator} from "react-native";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";

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
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>
      
      {/* Header */}
      <Text style={styles.header}>My Profile</Text>

      {/* Basic Info Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role}</Text>
      </View>

      {/* Editable Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Details</Text>

        <TextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          placeholderTextColor="#94A3B8"
        />

        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          placeholderTextColor="#94A3B8"
        />

        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
          style={styles.input}
          placeholderTextColor="#94A3B8"
        />

        {user?.role === "elder" && (
          <TextInput
            placeholder="Emergency Contact"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            style={styles.input}
            placeholderTextColor="#94A3B8"
          />
        )}
      </View>

      {/* Upload Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Government ID</Text>

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadText}>Upload ID</Text>
        </TouchableOpacity>

        {idImage && (
          <Image
            source={{ uri: idImage }}
            style={styles.imagePreview}
          />
        )}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveProfile}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.saveText}>Save Profile</Text>
        )}
      </TouchableOpacity>

      {/* Verification Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Verification Status</Text>

        <Text
          style={[
            styles.statusBadge,
            user?.verification?.status === "approved"
              ? styles.approved
              : user?.verification?.status === "rejected"
              ? styles.rejected
              : styles.pending,
          ]}
        >
          {user?.verification?.status || "Not Uploaded"}
        </Text>

        {user?.verification?.status === "rejected" && (
          <Text style={styles.rejectionText}>
            Reason: {user?.verification?.rejectionReason}
          </Text>
        )}
      </View>
    </ScrollView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 24,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E293B",
  },

  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#334155",
  },

  label: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 8,
  },

  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },

  input: {
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    marginBottom: 15,
    color: "#1E293B",
  },

  uploadButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  uploadText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },

  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginTop: 15,
  },

  saveButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 25,
  },

  saveText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },

  statusCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },

  statusTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#475569",
  },

  statusBadge: {
    fontSize: 18,
    fontWeight: "bold",
  },

  approved: {
    color: "#16A34A",
  },

  rejected: {
    color: "#DC2626",
  },

  pending: {
    color: "#F59E0B",
  },

  rejectionText: {
    marginTop: 8,
    color: "#DC2626",
    fontSize: 16,
  },
});
