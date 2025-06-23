import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import {
  getTransactionsByWalletId,
  getUserWallets,
  getWalletBalance,
} from "../../services/apiServices";

// ==== Hàm lấy icon theo category ====
const getCategoryIcon = (categoryName) => {
  if (!categoryName)
    return <MaterialIcons name="money" size={22} color="#333" />;

  const lower = categoryName.toLowerCase();

  if (lower.includes("lương") || lower.includes("doanh thu"))
    return <MaterialIcons name="attach-money" size={24} color="#28a745" />;

  if (lower.includes("ăn uống") || lower.includes("nhà hàng"))
    return <MaterialIcons name="restaurant" size={22} color="#f39c12" />;

  if (
    lower.includes("mua sắm") ||
    lower.includes("thời trang") ||
    lower.includes("mỹ phẩm")
  )
    return <FontAwesome5 name="shopping-bag" size={20} color="#e91e63" />;

  if (lower.includes("giải trí"))
    return <MaterialIcons name="sports-esports" size={22} color="#9c27b0" />;

  if (lower.includes("giáo dục") || lower.includes("sách"))
    return <FontAwesome5 name="book" size={20} color="#3f51b5" />;

  if (lower.includes("sức khoẻ"))
    return <MaterialIcons name="health-and-safety" size={22} color="#4caf50" />;

  if (lower.includes("bảo hiểm"))
    return <Entypo name="shield" size={22} color="#009688" />;

  if (lower.includes("du lịch"))
    return <MaterialIcons name="travel-explore" size={22} color="#03a9f4" />;

  if (lower.includes("thể thao"))
    return <MaterialIcons name="sports-soccer" size={22} color="#ff5722" />;

  if (lower.includes("gia dụng"))
    return <Feather name="tool" size={22} color="#607d8b" />;

  if (
    lower.includes("hoá đơn") ||
    lower.includes("phí") ||
    lower.includes("thuế")
  )
    return <MaterialIcons name="receipt" size={22} color="#795548" />;

  if (lower.includes("phương tiện") || lower.includes("đi lại"))
    return <FontAwesome5 name="car" size={20} color="#607d8b" />;

  if (lower.includes("ví điện tử"))
    return <FontAwesome5 name="wallet" size={20} color="#673ab7" />;

  if (lower.includes("từ thiện"))
    return <FontAwesome5 name="hands-helping" size={20} color="#c2185b" />;

  if (lower.includes("đầu tư") || lower.includes("vay"))
    return <Entypo name="line-graph" size={22} color="#009688" />;

  if (lower.includes("quà"))
    return <FontAwesome5 name="gift" size={20} color="#ff9800" />;

  if (lower.includes("thẻ tín dụng"))
    return <FontAwesome5 name="credit-card" size={20} color="#f44336" />;

  return <MaterialIcons name="money" size={22} color="#333" />;
};

export default function HomeScreenMain({ navigation }) {
  const [walletId, setWalletId] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetchWalletId();
  }, []);

  useEffect(() => {
    if (walletId) {
      fetchTransactionByWalletId(walletId);
      fetchWalletBalance(walletId);
    }
  }, [walletId]);

  const fetchWalletId = async () => {
    try {
      const res = await getUserWallets();
      setWallets(res);
      const selected = res.find((item) => item.type === "DEFAULT");
      setWalletId(selected.id);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWalletBalance = async (id) => {
    try {
      const result = await getWalletBalance(id);
      setSummary(result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTransactionByWalletId = async (id) => {
    try {
      const res = await getTransactionsByWalletId(id);
      const sorted = res
        .sort(
          (a, b) =>
            new Date(b.transactionTime).getTime() -
            new Date(a.transactionTime).getTime()
        )
        .slice(0, 3);

      const mapped = sorted.map((item) => ({
        id: item.id,
        amount: item.amount,
        title: item.description,
        date: new Date(item.transactionTime).toLocaleDateString("vi-VN"),
        isIncome: item.amount >= 0,
        category: item.categoryName,
      }));
      setRecent(mapped);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Tổng quan tài chính */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Total Balance</Text>
        <Text style={styles.balance}>
          {summary?.netAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
        <View style={styles.rowBetween}>
          <Text style={styles.income}>
            Income:{" "}
            {summary?.totalIncome.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
          <Text style={styles.expense}>
            Expense:{" "}
            {summary?.totalExpense.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
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

        {recent.length === 0 ? (
          <Text style={{ fontStyle: "italic", color: "#888" }}>
            No recent transactions
          </Text>
        ) : (
          recent.map((item) => (
            <View key={item.id} style={styles.transactionCard}>
              <View style={styles.transactionRow}>
                <View style={styles.transactionIcon}>
                  {getCategoryIcon(item.category)}
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionDate}>{item.date}</Text>
                </View>
              </View>
              <Text
                style={
                  item.isIncome
                    ? styles.transactionAmountIncome
                    : styles.transactionAmount
                }
              >
                {item.isIncome ? "+" : "-"}{" "}
                {Math.abs(item.amount).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
            </View>
          ))
        )}
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

      {/* Danh sách ví người dùng */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>User Wallets</Text>

        {wallets.length === 0 ? (
          <Text style={{ fontStyle: "italic", color: "#888" }}>
            No wallets available
          </Text>
        ) : (
          wallets.map((wallet) => (
            <View key={wallet.id} style={styles.transactionCard}>
              <View style={styles.transactionRow}>
                <FontAwesome5
                  name="wallet"
                  size={20}
                  color="#1d4ed8"
                  style={styles.transactionIcon}
                />
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{wallet.name}</Text>
                  <Text style={styles.transactionDate}>
                    Balance:{" "}
                    {wallet.balance.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.addAccountButton}
          onPress={() => navigation.navigate("Wallet")}
        >
          <Text style={{ color: "#1d4ed8" }}>+ Add Wallet</Text>
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
    alignItems: "center",
    justifyContent: "center",
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
