import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  addNewTransaction,
  getAllCategories,
  getUserWallets,
} from "../../services/apiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddTransactionScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [open, setOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  const [walletValue, setWalletValue] = useState(null);
  const [loading, setLoading] = useState(false); // trạng thái loading cho button

  useEffect(() => {
    fetchAllCategories();
    fetchUserDefaultWallets();
  }, []);

  useEffect(() => {
    if (categoryItems.length > 0) {
      loadStoredData();
    }
  }, [categoryItems]);

  const loadStoredData = async () => {
    try {
      const storedAmount = await AsyncStorage.getItem("amount");
      const storedCategory = await AsyncStorage.getItem("category");
      const storedDescription = await AsyncStorage.getItem("description");

      if (storedAmount !== null) setAmount(parseInt(storedAmount));
      if (storedDescription !== null) setNote(storedDescription);
      if (storedCategory !== null && categoryItems.length > 0) {
        const found = categoryItems.find(
          (item) => item.label.toLowerCase() === storedCategory.toLowerCase()
        );
        if (found) {
          setCategoryValue(found.value);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategoryItems(res.map((c) => ({ label: c.name, value: c.id })));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserDefaultWallets = async () => {
    try {
      const res = await getUserWallets();
      const defaultW = res.filter((w) => w.type === "DEFAULT");
      setWalletValue(defaultW[0]?.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
    setShowPicker(false);
  };

  const handleSubmit = async () => {
    if (!amount || !categoryValue || !walletValue) {
      Toast.show({
        type: "error",
        text1: "Missing fields!",
        text2: "Please complete all fields!",
      });
      return;
    }

    setLoading(true); // bật loading khi submit
    try {
      const payload = {
        amount: parseFloat(amount),
        description: note,
        walletId: walletValue,
        categoryId: categoryValue,
        transactionTime: date.toISOString(),
      };
      const res = await addNewTransaction(payload);

      if (res) {
        Toast.show({
          type: "success",
          text1: "Transaction Added!",
        });
        AsyncStorage.removeItem("amount");
        AsyncStorage.removeItem("category");
        AsyncStorage.removeItem("description");
        navigation.navigate("Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Added Failed!",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // tắt loading khi xong
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount (e.g. -100)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Category</Text>
      <DropDownPicker
        open={open}
        value={categoryValue}
        items={categoryItems}
        setOpen={setOpen}
        setValue={setCategoryValue}
        setItems={setCategoryItems}
        placeholder="Select category"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={3000}
        zIndexInverse={1000}
      />

      <Text style={styles.label}>Transaction Time</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput
          style={styles.input}
          value={date.toLocaleString()}
          editable={false}
          placeholder="Pick a date & time"
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Note</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Optional note (e.g. Coffee, Rent, Bonus...)"
        value={note}
        onChangeText={setNote}
        multiline={true}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Transaction</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#eef4ff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    color: "#1d4ed8",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#1d4ed8",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#1d4ed8",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },
  dropdown: {
    borderColor: "#1d4ed8",
    marginTop: 5,
  },
  dropdownContainer: {
    borderColor: "#1d4ed8",
  },
  button: {
    backgroundColor: "#1d4ed8",
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
