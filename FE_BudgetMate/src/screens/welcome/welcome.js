import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
          />
        </View>
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.title}>Welcome to BudgetMate</Text>
        <Text style={styles.subtitle}>Your smart budgeting assistant</Text>

        <Text style={styles.appDescription}>
          BudgetMate helps you manage your expenses and track your spending
          effortlessly. Set your budget, monitor your spending habits, and keep
          track of your financial goals.
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Icon name="cash-outline" size={30} color="#2563EB" />
            <Text style={styles.featureText}>Track Spending</Text>
          </View>
          <View style={styles.feature}>
            <Icon name="wallet-outline" size={30} color="#2563EB" />
            <Text style={styles.featureText}>Set Budget</Text>
          </View>
          <View style={styles.feature}>
            <Icon name="bar-chart-outline" size={30} color="#2563EB" />
            <Text style={styles.featureText}>Spending Reports</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Icon
            name="log-in-outline"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={styles.signupLink}>Create one</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
    marginTop: 40,
  },
  middleSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  bottomSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
  },
  appDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 30,
  },
  appImage: {
    width: "80%",
    height: 180,
    resizeMode: "contain",
    marginBottom: 30,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  feature: {
    alignItems: "center",
  },
  featureText: {
    fontSize: 14,
    color: "#2563EB",
    marginTop: 8,
  },
  loginButton: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginBottom: 18,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
  signupText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signupLink: {
    color: "#2563EB",
    fontWeight: "500",
  },
});
