import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import {
  getQuizStatus,
  getTransactionsByWalletId,
  getUserWallets,
  getWalletBalance,
  getAuthenticatedUser,
  getUnreadNoti,
  getCurrentSubcription,
} from "../../services/apiServices";
import Toast from "react-native-toast-message";

const categoryIconMap = {
  salary: <MaterialIcons name="attach-money" size={22} />,
  income: <MaterialIcons name="attach-money" size={22} />,
  "dining out": <MaterialIcons name="restaurant" size={22} />,
  restaurant: <MaterialIcons name="restaurant" size={22} />,
  shopping: <FontAwesome5 name="shopping-bag" size={20} />,
  fashion: <FontAwesome5 name="shopping-bag" size={20} />,
  cosmetics: <FontAwesome5 name="shopping-bag" size={20} />,
  groceries: <MaterialIcons name="local-grocery-store" size={22} />,
  education: <FontAwesome5 name="book" size={20} />,
  health: <MaterialIcons name="health-and-safety" size={22} />,
  insurance: <Entypo name="shield" size={22} />,
  travel: <MaterialIcons name="travel-explore" size={22} />,
  sports: <MaterialIcons name="sports-soccer" size={22} />,
  appliances: <Feather name="tool" size={22} />,
  bills: <MaterialIcons name="receipt" size={22} />,
  utilities: <MaterialIcons name="receipt" size={22} />,
  transportation: <FontAwesome5 name="car" size={20} />,
  vehicle: <FontAwesome5 name="car" size={20} />,
  "e-wallet": <FontAwesome5 name="wallet" size={20} />,
  charity: <FontAwesome5 name="hands-helping" size={20} />,
  investing: <Entypo name="line-graph" size={22} />,
  loan: <Entypo name="line-graph" size={22} />,
  gifts: <FontAwesome5 name="gift" size={20} />,
  "credit card": <FontAwesome5 name="credit-card" size={20} />,
  entertainment: <MaterialIcons name="sports-esports" size={22} />,
  tax: <MaterialIcons name="receipt" size={22} />,
  others: <MaterialIcons name="category" size={22} />,
};

const getCategoryIcon = (categoryName, color = "#333") => {
  if (!categoryName) {
    return <MaterialIcons name="money" size={22} color={color} />;
  }
  const key = categoryName.toLowerCase().trim();
  const iconElement = categoryIconMap[key];
  if (iconElement) {
    return React.cloneElement(iconElement, { color });
  }
  return <MaterialIcons name="money" size={22} color={color} />;
};

export default function HomeScreenMain({ navigation }) {
  const [walletId, setWalletId] = useState(null);
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [quizStatus, setQuizStatus] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [curPack, setCurPack] = useState(null);

  useEffect(() => {
    fetchWalletId();
    fecthQuizStatus();
    getCurrentUser();
    fetchUnreadNoti();
    fetchCurrentMemebership();
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

  const getCurrentUser = async () => {
    try {
      const res = await getAuthenticatedUser();
      setUser(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentMemebership = async () => {
    try {
      const res = await getCurrentSubcription();
      setCurPack(res?.membershipPlan);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUnreadNoti = async () => {
    try {
      const res = await getUnreadNoti();
      setUnreadCount(res);
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
      setLoadingRecent(true);
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
    } finally {
      setLoadingRecent(false);
    }
  };

  const fecthQuizStatus = async () => {
    try {
      const res = await getQuizStatus();
      setQuizStatus(res);
    } catch (error) {
      console.log(error);
    }
  };

  const hasAdvancedAnalytics = () => {
    if (!curPack?.features) return false;
    return curPack.features.some(
      (f) => f.feature?.featureKey === "ADVANCED_ANALYTICS" && f.isEnabled
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Welcome, {user?.fullName || "User"}
        </Text>
        <TouchableOpacity
          style={styles.notificationIconContainer}
          onPress={() => navigation.navigate("Notification")}
        >
          <MaterialIcons name="notifications-none" size={28} color="#1d4ed8" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

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

        {loadingRecent ? (
          <ActivityIndicator size="small" color="#1d4ed8" />
        ) : recent.length === 0 ? (
          <Text style={{ fontStyle: "italic", color: "#888" }}>
            No recent transactions
          </Text>
        ) : (
          recent.map((item) => (
            <View key={item.id} style={styles.transactionCard}>
              <View style={styles.transactionRow}>
                <View style={styles.transactionIcon}>
                  {getCategoryIcon(item.category, item.color)}
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

      <TouchableOpacity
        style={[
          styles.financialAnalysisButton,
          !hasAdvancedAnalytics() && { backgroundColor: "#94a3b8" },
        ]}
        onPress={() => {
          if (hasAdvancedAnalytics()) {
            navigation.navigate("FinancialAnalysis");
          } else {
            Toast.show({
              type: "error",
              text1: "Upgrade Required!",
              text2:
                "You need to subscribe to a membership plan with Advanced Analytics to use this feature.",
            });
          }
        }}
        disabled={!hasAdvancedAnalytics()}
      >
        <Text style={styles.financialAnalysisText}>📊 Financial Analysis</Text>
      </TouchableOpacity>

      {/* Thành tựu */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Achievement</Text>

        <Text style={styles.achievementItem}>
          🔥 Streak: {user?.streakDays} days
        </Text>

        {quizStatus ? (
          <View style={styles.achievementGroup}>
            <Text style={styles.achievementItem}>
              ✅ Completed Quizzes: {quizStatus.completedQuizzes}/
              {quizStatus.dailyLimit}
            </Text>
            <Text style={styles.achievementItem}>
              🧠 Can Take Quiz:{" "}
              <Text
                style={{
                  color: quizStatus.canTakeQuiz ? "#16a34a" : "#dc2626",
                }}
              >
                {quizStatus.canTakeQuiz ? "Yes" : "No"}
              </Text>
            </Text>
            <Text style={styles.achievementItem}>
              💰 Credits Earned: {quizStatus.creditsEarnedToday}
            </Text>

            {quizStatus.remainingQuizzes > 0 && (
              <TouchableOpacity
                style={styles.quizButton}
                onPress={() => navigation.navigate("Quiz")}
              >
                <Text style={styles.quizButtonText}>🎮 Play Quiz</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={{ fontStyle: "italic", color: "#888" }}>
            Loading quiz status...
          </Text>
        )}
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

      <View style={styles.membershipContainer}>
        <Text style={styles.membershipText}>You want more Features?</Text>
        <TouchableOpacity
          style={styles.membershipButton}
          onPress={() => navigation.navigate("Membership")}
        >
          <Text style={styles.membershipButtonText}>Upgrade Now</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  notificationIconContainer: {
    position: "relative",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 1,
  },

  notificationBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
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
  quizButton: {
    marginTop: 10,
    backgroundColor: "#1d4ed8",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  quizButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  membershipContainer: {
    backgroundColor: "#e0f2fe",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  membershipText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: 8,
  },
  membershipButton: {
    backgroundColor: "#0284c7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  membershipButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  financialAnalysisButton: {
    backgroundColor: "#0d9488",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -10,
    marginBottom: 15,
  },
  financialAnalysisText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
