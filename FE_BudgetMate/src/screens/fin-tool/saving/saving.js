import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteWallet, getUserWallets } from "../../../services/apiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function SavingScreen({ navigation }) {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const walletType = "SAVINGS";

  useEffect(() => {
    fetchAllSavingWallets();
  }, []);

  const fetchAllSavingWallets = async () => {
    try {
      setLoading(true);
      const res = await getUserWallets();
      const savings = res.filter((item) => item.type === "SAVINGS");
      setWallets(savings);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Failed to load saving wallets!",
      });
    } finally {
      setLoading(false);
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
        fetchAllSavingWallets();
      } else {
        Toast.show({
          type: "error",
          text1: "Delete wallet failed!",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong!",
      });
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home", { screen: "Tools" })}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Go Back</Text>
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
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <View style={styles.tabContent}>
            <Ionicons name="wallet" size={18} color="#fff" />
            <Text style={[styles.tabText, styles.activeTabText]}>Saving</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("DebtScreen")}
        >
          <View style={styles.tabContent}>
            <Ionicons name="card" size={18} color="#666" />
            <Text style={styles.tabText}>Debt</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.body}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#00C4CC"
            style={{ marginTop: 40 }}
          />
        ) : wallets.length === 0 ? (
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

      <TouchableOpacity style={styles.addButton} onPress={handleNavigation}>
        <Ionicons name="add" size={18} color="white" />
        <Text style={styles.addButtonText}>Add Saving</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
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
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  savedText: {
    color: "#00C4CC",
    marginTop: 8,
    fontSize: 16,
  },
  progressBarContainer: {
    marginVertical: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#00C4CC",
  },
  percentage: {
    marginTop: 4,
    alignSelf: "center",
    fontSize: 12,
    color: "#00bcd4",
    fontWeight: "bold",
  },
  goalDate: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
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
