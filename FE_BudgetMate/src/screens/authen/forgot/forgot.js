import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import logo from "../../../../assets/logo.png";
import { forgotPassword } from "../../../services/apiServices";
import Toast from "react-native-toast-message";

export default function Forgot({ navigation }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false); // state loading

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email, please enter again!");
      return;
    }
    setEmailError("");

    try {
      setLoading(true); // bật loading
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
    } finally {
      setLoading(false); // tắt loading
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
          style={[styles.input, emailError ? { borderColor: "red" } : null]}
          placeholder="Email address"
          placeholderTextColor="#888"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading} // chặn bấm khi đang loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
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
    marginBottom: 8,
    backgroundColor: "#fff",
    color: "#111827",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 12,
    marginLeft: 4,
    fontSize: 13,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
