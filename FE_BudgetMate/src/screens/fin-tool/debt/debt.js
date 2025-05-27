import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";

const DebtScreen = ({ navigation }) => {
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.debtTitle}>House</Text>
            <TouchableOpacity>
              <Ionicons name="create-outline" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          <Text style={styles.amountText}>
            Paid <Text style={styles.amountHighlight}>₫500,000,000</Text> /
            ₫1,200,000,000
          </Text>

          <View style={styles.progressWrapper}>
            <ProgressBar
              progress={0.42}
              color="#00bcd4"
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>42% remaining</Text>
          </View>

          <Text style={styles.dateText}>Due Date: Dec 12, 2025</Text>
          <Text style={styles.remainingText}>213 days left until due</Text>
        </View>
      </ScrollView>

      {/* Add Debt Button */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={18} color="white" />
        <Text style={styles.addButtonText}>Add Debt</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DebtScreen;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
  backText: {
    fontSize: 18,
    color: "black",
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
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
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
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  debtTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  amountText: {
    fontSize: 14,
    marginTop: 12,
  },
  amountHighlight: {
    color: "#00bcd4",
    fontWeight: "bold",
  },
  progressWrapper: {
    marginTop: 16,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    marginTop: 2,
    alignSelf: "center",
    fontSize: 12,
    color: "#00bcd4",
    fontWeight: "bold",
  },
  dateText: {
    marginTop: 16,
    fontSize: 13,
    color: "#333",
  },
  remainingText: {
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
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
