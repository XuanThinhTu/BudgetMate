import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function FinancialToolsScreen() {
  const navigation = useNavigation();

  const tools = [
    {
      icon: "pie-chart",
      title: "Budget",
      description: "Set a monthly budget to track your spending.",
      onPress: () => navigation.navigate("BudgetScreen"),
    },
    {
      icon: "cash",
      title: "Savings",
      description: "Set a savings goal and track your saving progress!",
      onPress: () => navigation.navigate("SavingsScreen"),
    },
    {
      icon: "card",
      title: "Debt",
      description: "Track your debts and work towards paying them off!",
      onPress: () => navigation.navigate("DebtScreen"),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Tools</Text>
      <Text style={styles.subtitle}>Choose a tool to manage your finances</Text>

      {tools.map((tool, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={tool.onPress}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={tool.icon} size={28} color="#0ea5e9" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{tool.title}</Text>
            <Text style={styles.cardDescription}>{tool.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: "#e0f2fe",
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  cardDescription: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
});
