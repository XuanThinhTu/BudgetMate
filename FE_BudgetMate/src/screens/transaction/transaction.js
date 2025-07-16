import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  MaterialIcons,
  FontAwesome5,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import {
  getTransactionsByWalletId,
  getUserWallets,
} from "../../services/apiServices";

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

export default function TransactionScreen({ navigation }) {
  const [allWallets, setAllWallets] = useState([]);
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [walletOptions, setWalletOptions] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  useEffect(() => {
    fetchAllWallets();
  }, []);

  useEffect(() => {
    if (selectedWalletId) {
      fetchAllTransactions(selectedWalletId);
    }
  }, [selectedWalletId]);

  const fetchAllWallets = async () => {
    try {
      const res = await getUserWallets();
      setAllWallets(res);

      const options = res.map((w) => ({
        label: w.name,
        value: w.id,
      }));
      setWalletOptions(options);

      if (res.length > 0) {
        setSelectedWalletId(res[res.length - 1].id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllTransactions = async (walletId) => {
    try {
      const res = await getTransactionsByWalletId(walletId);
      const mapped = res.map((item) => {
        const dateObj = new Date(item.transactionTime);

        const date = dateObj.toLocaleDateString("vi-VN");
        const time = dateObj.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        const type = item.amount < 0 ? "expense" : "income";

        return {
          id: item.id,
          amount: Math.abs(item.amount),
          title: item.description,
          time,
          date,
          categoryId: item.categoryId,
          category: item.categoryName || "other",
          type,
          walletId: item.walletId,
          walletName: item.walletName,
          originalAmount: item.originalAmount,
          originalDescription: item.originalDescription,
          originalTransactionTime: item.originalTransactionTime,
        };
      });

      setTransactions(mapped);
    } catch (error) {
      console.log(error);
    }
  };

  const groupedByDate = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.date]) acc[transaction.date] = [];
    acc[transaction.date].push(transaction);
    return acc;
  }, {});

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>All Transactions in </Text>
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={openDropdown}
            value={selectedWalletId}
            items={walletOptions}
            setOpen={setOpenDropdown}
            setValue={setSelectedWalletId}
            setItems={setWalletOptions}
            placeholder="Select Wallet"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            labelStyle={{ fontSize: 16 }}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        <View style={styles.totalContainer}>
          <View style={[styles.totalBox, styles.incomeBox]}>
            <Text style={styles.totalLabel}>Total Income</Text>
            <Text style={styles.totalAmount}>
              {totalIncome.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
          <View style={[styles.totalBox, styles.expenseBox]}>
            <Text style={styles.totalLabel}>Total Expense</Text>
            <Text style={styles.totalAmount}>
              {totalExpense.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Text>
          </View>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
          </View>
        ) : (
          Object.entries(groupedByDate).map(([date, items]) => (
            <View key={date} style={styles.group}>
              <Text style={styles.date}>{date}</Text>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.transactionCard}
                  onPress={() =>
                    navigation.navigate("TransDetails", { transaction: item })
                  }
                >
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
                    {item.type === "income" ? "+" : "-"}{" "}
                    {item.amount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 1000,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginRight: 8,
  },
  dropdownWrapper: {
    flex: 1,
    zIndex: 1000,
  },
  dropdown: {
    height: 40,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    zIndex: 1000,
    elevation: 10,
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
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },
});
