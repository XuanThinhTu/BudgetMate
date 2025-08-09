import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  FontAwesome5,
  MaterialIcons,
  Feather,
  Entypo,
} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import {
  getAuthenticatedUser,
  getPurchasedFeatures,
} from "../../services/apiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  const fetchAuthenticatedUser = async () => {
    try {
      const res = await getAuthenticatedUser();
      setUser(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
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
        {user?.avatar ? (
          <Image source={{ uri: user?.avatar }} style={styles.avatarImg} />
        ) : (
          <FontAwesome5
            name="user-circle"
            size={80}
            color="#007BFF"
            style={styles.avatar}
          />
        )}

        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.balance}>Credits: {user?.credits}</Text>

        <TouchableOpacity
          style={styles.creditHistoryButton}
          onPress={() => navigation.navigate("CreditHistory")}
        >
          <FontAwesome5 name="history" size={18} color="#fff" />
          <Text style={styles.creditHistoryText}>Credits Used History</Text>
        </TouchableOpacity>

        <View style={styles.infoRow}>
          <Feather name="phone" size={20} color="#007BFF" />
          <Text style={styles.infoText}>{user?.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={20} color="#007BFF" />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Feather name="home" size={20} color="#007BFF" />
          <Text style={styles.infoText}>{user?.address}</Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome5 name="paw" size={20} color="#007BFF" />
          <Text style={styles.infoText}>Pet: {user?.petName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Entypo name="user" size={20} color="#007BFF" />
          <Text style={styles.infoText}>Role: {user?.roleName}</Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome5 name="fire" size={20} color="#FF4500" />
          <Text style={styles.infoText}>Streak Days: {user?.streakDays}</Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome5 name="clock" size={20} color="#007BFF" />
          <Text style={styles.infoText}>
            Last Login: {new Date(user?.lastLoginDate).toLocaleString("vi-VN")}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome5 name="info-circle" size={20} color="#007BFF" />
          <Text style={styles.infoText}>Status: {user?.status}</Text>
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
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
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
  creditHistoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745", // xanh chủ đạo
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  creditHistoryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 8,
  },
});
