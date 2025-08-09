import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import logo from "../../../assets/logo.png";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { addNewTransactionByAI } from "../../services/apiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddTransQuick() {
  const [input, setInput] = useState("");
  const navigation = useNavigation();

  const handleQuickAdd = async () => {
    try {
      if (input.trim() === "") {
        Toast.show({
          type: "error",
          text1: "Please enter your description!",
        });
      } else {
        const payload = { description: input };
        const res = await addNewTransactionByAI(payload);

        if (res) {
          AsyncStorage.setItem("amount", res.amount);
          AsyncStorage.setItem("category", res.category);
          AsyncStorage.setItem("description", res.description);
          navigation.navigate("AddTrans");
        } else {
          Toast.show({
            type: "error",
            text1: "Add transaction by AI failed!",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goToAddPage = () => {
    navigation.navigate("AddTrans");
    setInput("");
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Add Transaction Quickly</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter transaction (e.g., $25 for lunch)"
        value={input}
        onChangeText={setInput}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleQuickAdd}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToAddPage}>
        <Text style={styles.manualText}>+ Add manually</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  manualText: {
    color: "#007bff",
    textAlign: "center",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
