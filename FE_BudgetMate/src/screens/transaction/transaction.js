import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import {
  getTransactionsByWalletId,
  getUserWallets,
} from "../../services/apiServices";

// Hàm icon cho từng loại category
const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
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
