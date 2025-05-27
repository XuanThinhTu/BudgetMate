import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";

export default function AddTransactionScreen() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([
    { label: "Salary", value: "Salary" },
    { label: "Shopping", value: "Shopping" },
    { label: "Utilities", value: "Utilities" },
    { label: "Food", value: "Food" },
    { label: "Other", value: "Other" },
  ]);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentValue, setPaymentValue] = useState(null);
  const [paymentItems, setPaymentItems] = useState([
    { label: "Cash", value: "Cash" },
    { label: "Bank Account", value: "Bank" },
  ]);

  const handleSubmit = () => {
    if (!amount || !categoryValue || !paymentValue) {
      Toast.show({
        type: "error",
        text1: "Missing fields!",
        text2: "Please complete all fields!",
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Transaction Added",
      text2: `Amount: ${amount}, Category: ${categoryValue}, Payment: ${paymentValue}, Note: ${note}`,
    });
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
        open={categoryOpen}
        value={categoryValue}
        items={categoryItems}
        setOpen={setCategoryOpen}
        setValue={setCategoryValue}
        setItems={setCategoryItems}
        placeholder="Select category"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={3000}
        zIndexInverse={1000}
      />

      <Text style={styles.label}>Payment Method</Text>
      <DropDownPicker
        open={paymentOpen}
        value={paymentValue}
        items={paymentItems}
        setOpen={setPaymentOpen}
        setValue={setPaymentValue}
        setItems={setPaymentItems}
        placeholder="Select method"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={2000}
        zIndexInverse={2000}
      />

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
