import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import logo from "../../../../assets/logo.png";
import { forgotPassword } from "../../../services/apiServices";
import Toast from "react-native-toast-message";

export default function Forgot({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await forgotPassword(email);

      if (res) {
        Toast.show({
          type: "success",
          text1: "Email sent success!",
          text2: "Please check your email to receive the link",
        });
        navigation.navigate("Login");
      } else {
        Toast.show({
          type: "error",
          text1: "Email sent failed!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.heading}>Forgot your password?</Text>
        <Text style={styles.description}>
          Enter your email address below and we’ll send you instructions to
          reset your password.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
  },
  inner: {
    padding: 24,
    alignItems: "center",
  },
  logo: {
    height: 80,
    marginBottom: 30,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
    color: "#111827",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
