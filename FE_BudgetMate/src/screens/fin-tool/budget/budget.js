import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BudgetScreen({ navigation }) {
  return (
    <View style={styles.container}>
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
        <TouchableOpacity style={[styles.activeTab, styles.tab]}>
          <View style={styles.tabContent}>
            <Ionicons name="pie-chart" size={18} color="#fff" />
            <Text style={styles.activeTabText}>Budget</Text>
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

      {/* Saving Card */}
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>Car</Text>
            <TouchableOpacity>
              <Ionicons name="create-outline" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          <Text style={styles.savedText}>
            Saved: ₫10,000,000 / ₫1,000,000,000
          </Text>

          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBar, { width: "1%" }]} />
            </View>
            <Text style={styles.percentage}>1%</Text>
          </View>

          <Text style={styles.goalDate}>
            🎯 Goal date: May 12, 2025{"\n"}0 days left until saving goal
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddBudgetScreen")}
      >
        <Ionicons name="add" size={18} color="white" />
        <Text style={styles.addButtonText}>Add Budget</Text>
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
});
