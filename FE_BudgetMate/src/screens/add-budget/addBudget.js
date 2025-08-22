import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator, // ⬅️ Import spinner
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addNewWallet } from "../../services/apiServices";
import Toast from "react-native-toast-message";

export default function AddBudgetScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [walletType, setWalletType] = useState("");
  const [category, setCategory] = useState(null);
  const [termMonth, setTermMonth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    handleLoadWalletType();
  }, []);

  const handleLoadWalletType = async () => {
    try {
      const res = await AsyncStorage.getItem("walletType");
      setWalletType(res);
    } catch (error) {
      console.log(error);
    }
  };

  const validateDob = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;

    const [year, month, day] = date.split("-").map(Number);
    if (year < 1950) return false;
    if (month < 1 || month > 12) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;

    return true;
  };

  const handleDateChange = (text) => {
    setDate(text);
    if (text === "" || validateDob(text)) {
      setDateError(""); // hợp lệ thì clear lỗi
    } else {
      setDateError("Invalid date, please enter again!");
    }
  };

  const handleAmountChange = (text) => {
    setAmount(text);

    if (text === "") {
      setAmountError("");
      return;
    }

    if (isNaN(text)) {
      setAmountError("Invalid type, please enter again!");
    } else {
      setAmountError("");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
    AsyncStorage.removeItem("walletType");
  };

  const handleSubmit = async () => {
    if (!validateDob(date)) {
      setDateError("Invalid date, please enter again!");
      return;
    }
    if (isNaN(amount) || amount === "") {
      setAmountError("Invalid type, please enter again!");
      return;
    }

    try {
      setLoading(true);
      const payload =
        walletType === "DEBT"
          ? {
              type: walletType,
              name: title,
              targetAmount: parseFloat(amount),
              deadline: date,
            }
          : {
              type: walletType,
              name: title,
              interestRate: parseFloat(amount),
              startDate: date,
              termMonths: parseInt(termMonth),
            };
      const res = await addNewWallet(payload);
      if (res) {
        Toast.show({
          type: "success",
          text1: `${walletType} Wallet Added!`,
        });
        navigation.goBack();
        AsyncStorage.removeItem("walletType");
      } else {
        Toast.show({
          type: "error",
          text1: `${walletType} Wallet Failed!`,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Create Monthly {walletType}</Text>
      <Text style={styles.subtitle}>
        Define a budget goal and track your spending effectively.
      </Text>

      {/* Wallet Type (readonly) */}
      <Text style={styles.label}>Wallet Type</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={walletType}
        editable={false}
      />

      {/* Title */}
      <Text style={styles.label}>Budget/Goal Title</Text>
      <TextInput
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      {/* Amount */}
      <Text style={styles.label}>
        {walletType === "DEBT" ? "Target Amount" : "Interest Rate"}
      </Text>
      <TextInput
        placeholder="Enter amount"
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
        style={styles.input}
      />
      {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}

      {/* Deadline */}
      <Text style={styles.label}>
        {walletType === "DEBT" ? "Deadline" : "Start Date"}
      </Text>
      <TextInput
        placeholder="yyyy-mm-dd"
        value={date}
        onChangeText={handleDateChange}
        style={styles.input}
      />
      {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

      {walletType === "SAVINGS" && (
        <>
          <Text style={styles.label}>Term Month</Text>
          <TextInput
            placeholder="Enter term in months"
            value={termMonth}
            onChangeText={setTermMonth}
            keyboardType="numeric"
            style={styles.input}
          />
        </>
      )}

      {/* Category Section */}
      <Text style={styles.label}>Budget/Goal Category</Text>
      <View style={styles.categoryRow}>
        <Ionicons name="help-circle" size={32} color="#00C4CC" />
        <Text style={styles.categoryText}>
          {category ? category : "Not categorized yet"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => setCategory("Daily Uses")}
      >
        <Text style={styles.categoryButtonText}>Daily Uses</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading} // disable khi loading
      >
        {loading ? (
          <ActivityIndicator color="#fff" /> // ⬅️ hiển thị spinner
        ) : (
          <Text style={styles.saveButtonText}>Save</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 50,
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  disabledInput: {
    backgroundColor: "#E0E0E0",
    color: "#888",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  categoryText: {
    fontSize: 15,
    color: "#333",
  },
  categoryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#00C4CC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 30,
  },
  categoryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#00C4CC",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});
