import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View, Alert } from "react-native";

import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import RoleSelectScreen from "../screens/RoleSelectScreen";

import ElderDashboard from "../screens/ElderDashboard";
import VolunteerDashboard from "../screens/VolunteerDashboard";
import NGODashboard from "../screens/NGODashboard";
import AdminDashboard from "../screens/AdminDashboard";

import CreateRequest from "../screens/CreateRequest";
import MyRequests from "../screens/MyRequests";
import AvailableRequests from "../screens/AvailiableRequests";
import MyTasks from "../screens/MyTasks";

import NGOStats from "../screens/NGOStats";
import NGORequests from "../screens/NGORequests";
import AssignVolunteer from "../screens/AssignVolunteer";
import NGOVolunteers from "../screens/NGOVolunteers";
import ManageUsers from "../screens/ManageUsers";
import ProfileMenu from "../components/ProfileMenu";
import MyProfile from "../screens/MyProfile";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (user && !user.profileCompleted) {
      Alert.alert(
        "Incomplete Profile",
        "Please complete your profile information.",
        [{ text: "Later" }, { text: "Go to Profile" }],
      );
    }
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerRight: () => (user ? <ProfileMenu /> : null),
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
          </>
        ) : user.role === "elder" ? (
          <>
            <Stack.Screen name="ElderDashboard" component={ElderDashboard} />
            <Stack.Screen name="CreateRequest" component={CreateRequest} />
            <Stack.Screen name="MyRequests" component={MyRequests} />
          </>
        ) : user.role === "volunteer" ? (
          <>
            <Stack.Screen
              name="VolunteerDashboard"
              component={VolunteerDashboard}
            />
            <Stack.Screen
              name="AvailableRequests"
              component={AvailableRequests}
            />
            <Stack.Screen name="MyTasks" component={MyTasks} />
          </>
        ) : user.role === "ngo" ? (
          <>
            <Stack.Screen name="NGODashboard" component={NGODashboard} />
            <Stack.Screen name="NGOStats" component={NGOStats} />
            <Stack.Screen name="NGORequests" component={NGORequests} />
            <Stack.Screen name="AssignVolunteer" component={AssignVolunteer} />
            <Stack.Screen
              name="NGOVolunteers"
              component={NGOVolunteers}
              options={{ title: "Volunteers" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="ManageUsers" component={ManageUsers} />
          </>
        )}
        <Stack.Screen name="MyProfile" component={MyProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
