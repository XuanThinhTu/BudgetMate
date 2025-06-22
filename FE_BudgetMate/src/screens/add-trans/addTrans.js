import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  addNewTransaction,
  getAllCategories,
  getUserWallets,
} from "../../services/apiServices";

export default function AddTransactionScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [open, setOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);

  const [walletOpen, setWalletOpen] = useState(false);
  const [walletValue, setWalletValue] = useState(null);
  const [walletItems, setWalletItems] = useState([]);

  useEffect(() => {
    fetchAllCategories();
    fetchAllUserWallets();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategoryItems(res.map((c) => ({ label: c.name, value: c.id })));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllUserWallets = async () => {
    try {
      const res = await getUserWallets();
      setWalletItems(res.map((w) => ({ label: w.name, value: w.id })));
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
        navigation.navigate("Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Added Failed!",
        });
      }
    } catch (error) {
      console.log(error);
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

      <Text style={styles.label}>Wallet</Text>
      <DropDownPicker
        open={walletOpen}
        value={walletValue}
        items={walletItems}
        setOpen={setWalletOpen}
        setValue={setWalletValue}
        setItems={setWalletItems}
        placeholder="Pick your wallet"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={2000}
        zIndexInverse={2000}
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

      <View style={styles.buttonContainer}>
        <Button
          title="Add Transaction"
          color="#1d4ed8"
          onPress={handleSubmit}
        />
      </View>
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
  buttonContainer: {
    marginTop: 30,
  },
});
