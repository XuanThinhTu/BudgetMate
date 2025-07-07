import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { registerFunction } from "../../../services/apiServices";

export default function SetupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");

  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("United States");
  const [countries, setCountries] = useState([
    { label: "United States", value: "United States" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Canada", value: "Canada" },
    { label: "Australia", value: "Australia" },
    { label: "Vietnam", value: "Vietnam" },
  ]);

  const handleSubmit = async () => {
    const address = `${street} ${city} ${country}`;
    const phone = await AsyncStorage.getItem("phone");
    const pass = await AsyncStorage.getItem("password");
    if (!fullName || !email || !dob || !address) return;
    const result = await registerFunction(
      email,
      pass,
      fullName,
      phone,
      address
    );
    if (result) {
      Toast.show({
        type: "success",
        text1: "Verification successful!",
      });
      navigation.navigate("Login");
    } else {
      Toast.show({
        type: "error",
        text1: "Verification failed!",
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>BudgetMate</Text>
      </View>

      <Text style={styles.header}>Complete Your Profile</Text>
      <Text style={styles.subheader}>Tell us more about yourself</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#999"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Date of Birth (YYYY-MM-DD)"
        placeholderTextColor="#999"
        style={styles.input}
        value={dob}
        onChangeText={setDob}
        keyboardType="numeric"
      />

      <View style={{ zIndex: 1000, width: "100%", marginBottom: 15 }}>
        <DropDownPicker
          open={open}
          value={country}
          items={countries}
          setOpen={setOpen}
          setValue={setCountry}
          setItems={setCountries}
          style={styles.dropdown}
          placeholder="Select a country"
        />
      </View>

      <View style={styles.addressContainer}>
        <TextInput
          placeholder="City"
          placeholderTextColor="#999"
          style={[styles.input, styles.halfInput]}
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          placeholder="Street, District"
          placeholderTextColor="#999"
          style={[styles.input, styles.halfInput]}
          value={street}
          onChangeText={setStreet}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0066cc",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1f2937",
  },
  subheader: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  halfInput: {
    width: "48%",
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
  },
  submitButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#0066cc",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
