import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";

const transactions = [
  {
    id: 1,
    title: "Salary",
    amount: 2000,
    type: "income",
    date: "2025-05-16",
    category: "salary",
    time: "08:00 AM",
  },
  {
    id: 2,
    title: "Groceries",
    amount: 50,
    type: "expense",
    date: "2025-05-16",
    category: "groceries",
    time: "12:30 PM",
  },
  {
    id: 3,
    title: "Electric Bill",
    amount: 120,
    type: "expense",
    date: "2025-05-15",
    category: "utilities",
    time: "10:00 AM",
  },
  {
    id: 4,
    title: "Freelance",
    amount: 500,
    type: "income",
    date: "2025-05-14",
    category: "freelance",
    time: "06:00 PM",
  },
];

const getCategoryIcon = (category) => {
  switch (category) {
    case "salary":
      return <MaterialIcons name="attach-money" size={24} color="#28a745" />;
    case "groceries":
      return <FontAwesome5 name="shopping-cart" size={20} color="#007bff" />;
    case "utilities":
      return <MaterialIcons name="receipt" size={22} color="#ff9800" />;
    case "freelance":
      return <Entypo name="briefcase" size={22} color="#4caf50" />;
    default:
      return <MaterialIcons name="money" size={22} color="#333" />;
  }
};

export default function TransactionScreen() {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const groupedByDate = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.date]) acc[transaction.date] = [];
    acc[transaction.date].push(transaction);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>All Transactions</Text>

      <View style={styles.totalContainer}>
        <View style={[styles.totalBox, styles.incomeBox]}>
          <Text style={styles.totalLabel}>Total Income</Text>
          <Text style={styles.totalAmount}>${totalIncome.toFixed(2)}</Text>
        </View>
        <View style={[styles.totalBox, styles.expenseBox]}>
          <Text style={styles.totalLabel}>Total Expense</Text>
          <Text style={styles.totalAmount}>${totalExpense.toFixed(2)}</Text>
        </View>
      </View>

      {Object.entries(groupedByDate).map(([date, items]) => (
        <View key={date} style={styles.group}>
          <Text style={styles.date}>{date}</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.transactionCard}>
              <View style={styles.iconContainer}>
                {getCategoryIcon(item.category)}
              </View>
              <View style={styles.details}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionTime}>{item.time}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  item.type === "income" ? styles.income : styles.expense,
                ]}
              >
                {item.type === "income" ? "+" : "-"} ${item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  incomeBox: {
    backgroundColor: "#d4edda",
  },
  expenseBox: {
    backgroundColor: "#f8d7da",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 12,
  },
  group: {
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    fontWeight: "600",
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 14,
  },
  details: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  transactionTime: {
    fontSize: 12,
    color: "#888",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  income: {
    color: "#28a745",
  },
  expense: {
    color: "#dc3545",
  },
});
