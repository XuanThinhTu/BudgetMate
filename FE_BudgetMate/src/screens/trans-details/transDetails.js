import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import {
  deleteTransaction,
  getAllCategories,
  getUserWallets,
  updateTransaction,
} from "../../services/apiServices";

export default function TransDetails({ route, navigation }) {
  const { transaction } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...transaction,
    category: transaction.categoryId,
    wallet: transaction.walletId,
    type: transaction.type,
  });

  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);

  const [openCategory, setOpenCategory] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [day, month, year] = transaction.date.split("/");
  const [hour, minute] = transaction.time.split(":");
  const initialDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  );
  const [selectedDateTime, setSelectedDateTime] = useState(initialDate);
  const adjustedDate = new Date(
    selectedDateTime.getTime() - selectedDateTime.getTimezoneOffset() * 60000
  );
  const localISOString = adjustedDate.toISOString();

  useEffect(() => {
    fetchCategories();
    fetchWallets();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWallets = async () => {
    try {
      const res = await getUserWallets();
      setWallets(res);
    } catch (error) {
      console.log(error);
    }
  };

  const isIncome = formData.type === "income";
  const formattedAmount = Math.abs(formData.amount).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const handleDelete = async (id) => {
    try {
      const res = await deleteTransaction(id);
      if (res) {
        Toast.show({ type: "success", text1: "Transaction Deleted!" });
        navigation.navigate("Home", { screen: "Transaction" });
      } else {
        Toast.show({ type: "error", text1: "Delete Failed!" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      const updated = {
        amount:
          formData.type === "income"
            ? +formData.amount
            : -Math.abs(+formData.amount),
        description: formData.title,
        walletId: formData.wallet,
        categoryId: formData.category,
        transactionTime: localISOString,
      };
      const res = await updateTransaction(transaction.id, updated);
      if (res) {
        Toast.show({
          type: "success",
          text1: "Transaction Updated!",
        });
        navigation.navigate("Home", { screen: "Transaction" });
      } else {
        Toast.show({
          type: "error",
          text1: "Update Failed!",
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getLabelById = (list, id) =>
    list.find((item) => item.id === id)?.name || "N/A";

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDateTime(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Amount</Text>
        {isEditing ? (
          <>
            <View style={styles.typeToggle}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  formData.type === "income" && styles.activeTypeBtn,
                ]}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, type: "income" }))
                }
              >
                <Text
                  style={[
                    styles.typeText,
                    formData.type === "income" && styles.activeTypeText,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  formData.type === "expense" && styles.activeTypeBtn,
                ]}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, type: "expense" }))
                }
              >
                <Text
                  style={[
                    styles.typeText,
                    formData.type === "expense" && styles.activeTypeText,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.amount.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, amount: text })
              }
            />
          </>
        ) : (
          <Text
            style={[styles.amount, isIncome ? styles.income : styles.expense]}
          >
            {isIncome ? "+" : "-"} {formattedAmount}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        ) : (
          <Text style={styles.value}>{formData.title}</Text>
        )}
      </View>

      <View style={[styles.section, { zIndex: 3000 }]}>
        <Text style={styles.label}>Category</Text>
        {isEditing ? (
          <DropDownPicker
            open={openCategory}
            setOpen={setOpenCategory}
            value={formData.category}
            setValue={(val) => setFormData({ ...formData, category: val() })}
            items={categories.map((c) => ({ label: c.name, value: c.id }))}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            placeholder="Select Category"
            zIndex={3000}
            zIndexInverse={1000}
          />
        ) : (
          <Text style={styles.value}>
            {getLabelById(categories, formData.category)}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Wallet</Text>
        <Text style={styles.value}>
          {getLabelById(wallets, formData.wallet)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date & Time</Text>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={styles.pickBtn}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickText}>Edit Date and Time</Text>
            </TouchableOpacity>
            <Text style={styles.value}>
              {selectedDateTime.toLocaleDateString("vi-VN")} at{" "}
              {selectedDateTime.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDateTime}
                mode="datetime"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
              />
            )}
          </>
        ) : (
          <Text style={styles.value}>
            {formData.date} at {formData.time}
          </Text>
        )}
      </View>

      {isEditing ? (
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <MaterialIcons name="save" size={22} color="#fff" />
          <Text style={styles.deleteText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.deleteBtn, { backgroundColor: "#007bff" }]}
          onPress={() => setIsEditing(true)}
        >
          <MaterialIcons name="edit" size={22} color="#fff" />
          <Text style={styles.deleteText}>Update Transaction</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(formData.id)}
      >
        <MaterialIcons name="delete" size={22} color="#fff" />
        <Text style={styles.deleteText}>Delete Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#222",
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#fff",
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  income: {
    color: "#28a745",
  },
  expense: {
    color: "#dc3545",
  },
  deleteBtn: {
    marginTop: 20,
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pickBtn: {
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 6,
  },
  pickText: {
    fontSize: 14,
    color: "#007bff",
  },
  deleteText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  typeToggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  typeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 6,
    marginHorizontal: 5,
  },
  activeTypeBtn: {
    backgroundColor: "#007bff",
  },
  typeText: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "600",
  },
  activeTypeText: {
    color: "#fff",
  },
});
