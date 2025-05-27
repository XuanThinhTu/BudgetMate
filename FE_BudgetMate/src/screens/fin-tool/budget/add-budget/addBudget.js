import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddBudgetScreen({ navigation }) {
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Create Monthly Budget</Text>
      <Text style={styles.subtitle}>
        Create a budget for your Expense or Income category below.
      </Text>

      {/* Toggle Buttons */}
      <View style={styles.toggleWrapper}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            type === "expense" && styles.activeToggle,
          ]}
          onPress={() => setType("expense")}
        >
          <Text
            style={
              type === "expense" ? styles.activeToggleText : styles.toggleText
            }
          >
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            type === "income" && styles.activeToggle,
          ]}
          onPress={() => setType("income")}
        >
          <Text
            style={
              type === "income" ? styles.activeToggleText : styles.toggleText
            }
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <TextInput
        placeholder="Budget/Goal Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Budget/Target Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Category Section */}
      <Text style={styles.categoryLabel}>Budget/Goal Category</Text>
      <View style={styles.categoryRow}>
        <Ionicons name="help-circle" size={32} color="#00C4CC" />
        <Text style={styles.categoryText}>
          {category ? category : "Not categorized yet"}
        </Text>
      </View>

      {/* Sample Category Button */}
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => setCategory("Daily Uses")}
      >
        <Text style={styles.categoryButtonText}>Daily uses</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 50,
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
    marginBottom: 20,
  },
  toggleWrapper: {
    flexDirection: "row",
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#E5E5EA",
    borderRadius: 20,
    marginRight: 10,
  },
  activeToggle: {
    backgroundColor: "#00C4CC",
  },
  toggleText: {
    color: "#000",
  },
  activeToggleText: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  categoryLabel: {
    marginBottom: 6,
    color: "#999",
    fontSize: 13,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  categoryText: {
    fontSize: 15,
    color: "#333",
  },
  categoryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#00C4CC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 30,
  },
  categoryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#00C4CC",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
