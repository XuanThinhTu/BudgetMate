import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome5, MaterialIcons, Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export default function ProfileScreen({ navigation }) {
  const userInfo = {
    name: "John Doe",
    phone: "+1 234 567 890",
    email: "john.doe@example.com",
    address: "123 Main St, Cityville",
    country: "United States",
    totalBalance: "$12,500.00",
  };

  const handleLogout = () => {
    Toast.show({
      type: "success",
      text1: "Logout success!",
    });
    navigation.navigate("Login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      <View style={styles.infoContainer}>
        <FontAwesome5
          name="user-circle"
          size={80}
          color="#007BFF"
          style={styles.avatar}
        />

        <Text style={styles.name}>{userInfo.name}</Text>
        <Text style={styles.balance}>
          Total Balance: {userInfo.totalBalance}
        </Text>

        <View style={styles.infoRow}>
          <Feather name="phone" size={20} color="#007BFF" />
          <Text style={styles.infoText}>{userInfo.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={20} color="#007BFF" />
          <Text style={styles.infoText}>{userInfo.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="home" size={20} color="#007BFF" />
          <Text style={styles.infoText}>{userInfo.address}</Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome5 name="flag" size={20} color="#007BFF" />
          <Text style={styles.infoText}>{userInfo.country}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    height: "100vh",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  avatar: {
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  balance: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007BFF",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    width: "100%",
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#555",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
