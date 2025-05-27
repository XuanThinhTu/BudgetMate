import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

export default function HomeScreenMain({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Tổng quan tài chính */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Total Balance</Text>
        <Text style={styles.balance}>$12,540.00</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.income}>Income: $8,400</Text>
          <Text style={styles.expense}>Expense: $3,120</Text>
        </View>
      </View>

      {/* Nút thêm giao dịch */}
      <TouchableOpacity
        style={styles.addTransactionButton}
        onPress={() => navigation.navigate("Add")}
      >
        <Text style={styles.addTransactionText}>+ New Transaction</Text>
      </TouchableOpacity>

      {/* Giao dịch gần đây */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Transaction")}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Mỗi giao dịch */}
        <View style={styles.transactionCard}>
          <View style={styles.transactionRow}>
            <FontAwesome5
              name="shopping-cart"
              size={20}
              color="#007BFF"
              style={styles.transactionIcon}
            />
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Groceries</Text>
              <Text style={styles.transactionDate}>May 15, 2025</Text>
            </View>
          </View>
          <Text style={styles.transactionAmount}>- $45.00</Text>
        </View>

        <View style={styles.transactionCard}>
          <View style={styles.transactionRow}>
            <MaterialIcons
              name="attach-money"
              size={24}
              color="#28a745"
              style={styles.transactionIcon}
            />
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Salary</Text>
              <Text style={styles.transactionDate}>May 14, 2025</Text>
            </View>
          </View>
          <Text style={styles.transactionAmountIncome}>+ $2,000.00</Text>
        </View>

        <View style={styles.transactionCard}>
          <View style={styles.transactionRow}>
            <MaterialIcons
              name="receipt"
              size={20}
              color="#FFA500"
              style={styles.transactionIcon}
            />
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Utilities</Text>
              <Text style={styles.transactionDate}>May 13, 2025</Text>
            </View>
          </View>
          <Text style={styles.transactionAmount}>- $120.00</Text>
        </View>
      </View>

      {/* Thành tựu */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Achievement</Text>
        <View style={styles.rowBetween}>
          <Text>Streak: 7 days</Text>
          <Text>Pet: Cat</Text>
          <Text>Saving Goal: 60%</Text>
        </View>
      </View>

      {/* Tài khoản ngân hàng */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Bank Accounts</Text>
        <View style={styles.transactionCard}>
          <Text style={styles.transactionTitle}>Bank of America</Text>
          <Text style={styles.transactionAmount}>$5,400.00</Text>
        </View>
        <View style={styles.transactionCard}>
          <Text style={styles.transactionTitle}>Chase</Text>
          <Text style={styles.transactionAmount}>$3,200.00</Text>
        </View>
        <TouchableOpacity style={styles.addAccountButton}>
          <Text style={{ color: "#1d4ed8" }}>+ Add Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ========== STYLE ==========
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f4f8",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e3a8a",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  viewAll: {
    color: "#1d4ed8",
    fontWeight: "bold",
    fontSize: 14,
  },
  addTransactionButton: {
    backgroundColor: "#1d4ed8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  addTransactionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  balance: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1d4ed8",
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  income: {
    color: "#16a34a",
  },
  expense: {
    color: "#dc2626",
  },
  transactionCard: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  transactionTitle: {
    fontWeight: "bold",
    color: "#1e40af",
  },
  transactionDate: {
    color: "#6b7280",
    fontSize: 12,
  },
  transactionAmount: {
    color: "#dc2626",
    fontWeight: "bold",
    textAlign: "right",
  },
  transactionAmountIncome: {
    color: "#16a34a",
    fontWeight: "bold",
    textAlign: "right",
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    marginRight: 10,
  },
  transactionInfo: {
    flex: 1,
  },
  addAccountButton: {
    marginTop: 8,
    padding: 10,
    alignItems: "center",
  },
});
