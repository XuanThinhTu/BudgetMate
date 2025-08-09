import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteWallet, getUserWallets } from "../../../services/apiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const DebtScreen = ({ navigation }) => {
  const [wallets, setWallets] = useState([]);
  const walletType = "DEBT";

  useEffect(() => {
    fetchAllDebtWallets();
  }, []);

  const fetchAllDebtWallets = async () => {
    try {
      const res = await getUserWallets();
      const savings = res.filter((item) => item.type === "DEBT");
      setWallets(savings);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigation = () => {
    navigation.navigate("AddBudgetScreen");
    AsyncStorage.setItem("walletType", walletType);
  };

  const handleDeleteWallet = async (id) => {
    try {
      const res = await deleteWallet(id);

      if (res) {
        Toast.show({
          type: "success",
          text1: "Delete wallet success!",
        });
        fetchAllDebtWallets();
      } else {
        Toast.show({
          type: "error",
          text1: "Delete wallet failed!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.backText}>Go Back</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("BudgetScreen")}
        >
          <View style={styles.tabContent}>
            <Ionicons name="pie-chart" size={18} color="#666" />
            <Text style={styles.tabText}>Budget</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("SavingsScreen")}
        >
          <View style={styles.tabContent}>
            <Ionicons name="wallet" size={18} color="#666" />
            <Text style={styles.tabText}>Saving</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <View style={styles.tabContent}>
            <Ionicons name="card" size={18} color="#fff" />
            <Text style={[styles.tabText, styles.activeTabText]}>Debt</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Debt Card */}
      <ScrollView contentContainerStyle={styles.body}>
        {wallets.length === 0 ? (
          <Text style={styles.emptyText}>
            You have not created any saving wallet yet.
          </Text>
        ) : (
          wallets.map((wallet) => {
            const savedAmount = wallet.balance;
            const targetAmount = wallet.targetAmount;
            const percentage = Math.min(
              100,
              Math.round((savedAmount / targetAmount) * 100)
            );

            const date = new Date(wallet.deadline);
            const formattedDate = date.toDateString();

            return (
              <View style={styles.card} key={wallet.id}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{wallet.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteWallet(wallet.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.savedText}>
                  Saved: ₫{savedAmount.toLocaleString()} / ₫
                  {targetAmount.toLocaleString()}
                </Text>

                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[styles.progressBar, { width: `${percentage}%` }]}
                    />
                  </View>
                  <Text style={styles.percentage}>{percentage}%</Text>
                </View>

                <Text style={styles.goalDate}>
                  🎯 Goal date: {formattedDate}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add Debt Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleNavigation}>
        <Ionicons name="add" size={18} color="white" />
        <Text style={styles.addButtonText}>Add Debt</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DebtScreen;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabText: {
    color: "#666",
    fontSize: 14,
  },
  activeTab: {
    backgroundColor: "#00C4CC",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  body: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  savedText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#00C4CC",
    borderRadius: 5,
  },
  percentage: {
    fontSize: 13,
    fontWeight: "500",
    color: "#00C4CC",
    width: 40,
  },
  goalDate: {
    fontSize: 13,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#1e4e73",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    gap: 6,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 15,
    color: "#888",
    marginTop: 40,
  },
});
