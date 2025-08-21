import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { addNewWallet, getUserWallets } from "../../services/apiServices";
import Toast from "react-native-toast-message";

export default function Wallet({ navigation }) {
  const [walletType, setWalletType] = useState("DEFAULT");
  const [userWallet, setUserWallet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Saving", value: "SAVINGS" },
    { label: "Debt", value: "DEBT" },
  ]);

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [deadline, setDeadline] = useState("");
  const isSaving = walletType !== "DEFAULT";

  useEffect(() => {
    fetchUserWallet();
  }, []);

  const fetchUserWallet = async () => {
    try {
      const res = await getUserWallets();
      setUserWallet(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateWallet = async () => {
    try {
      setLoading(true); // ✅ start loading
      const payload = {
        type: userWallet.length > 0 ? walletType : "DEFAULT",
        name: name,
        targetAmount: parseFloat(targetAmount),
        interestRate: isSaving ? parseFloat(interestRate) : null,
        deadline: isSaving ? deadline : null,
      };

      const res = await addNewWallet(payload);

      if (res) {
        Toast.show({
          type: "success",
          text1: "Add Wallet success!",
        });
        navigation.navigate("Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Add Wallet failed!",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Wallet</Text>

      {userWallet.length > 0 ? (
        <>
          <Text style={styles.label}>Wallet Type</Text>
          <DropDownPicker
            open={open}
            value={walletType}
            items={items}
            setOpen={setOpen}
            setValue={setWalletType}
            setItems={setItems}
            placeholder="Select wallet type"
            style={styles.dropdown}
            dropDownContainerStyle={{ borderColor: "#ccc" }}
          />
        </>
      ) : (
        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            Please fill in the information to add a new wallet to your account.
          </Text>
        </View>
      )}

      <Text style={styles.label}>Wallet Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter wallet name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Target Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter target amount"
        keyboardType="numeric"
        value={targetAmount}
        onChangeText={setTargetAmount}
      />

      <Text style={styles.label}>Interest Rate (%)</Text>
      <TextInput
        style={[styles.input, !isSaving && styles.disabledInput]}
        placeholder="Enter interest rate"
        keyboardType="numeric"
        value={interestRate}
        onChangeText={setInterestRate}
        editable={isSaving}
      />

      <Text style={styles.label}>Deadline</Text>
      <TextInput
        style={[styles.input, !isSaving && styles.disabledInput]}
        placeholder="Enter deadline (e.g. 2025-12-31)"
        value={deadline}
        onChangeText={setDeadline}
        editable={isSaving}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleCreateWallet}
        disabled={loading} // ✅ disable khi đang loading
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Wallet</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: Platform.OS === "ios" ? 12 : 8,
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  dropdown: {
    borderColor: "#ccc",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1890ff",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  noticeBox: {
    backgroundColor: "#e6f7ff",
    borderLeftWidth: 4,
    borderLeftColor: "#1890ff",
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  noticeText: {
    color: "#0050b3",
    fontSize: 15,
    lineHeight: 20,
  },
});
