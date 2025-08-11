import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Markdown from "react-native-markdown-display";
import { financialAnalysis } from "../../services/apiServices";

export default function FinancialAnalysisScreen() {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState("MONTHLY");
  const [items, setItems] = useState([
    { label: "Monthly", value: "MONTHLY" },
    { label: "Instantly", value: "INSTANTLY" },
  ]);

  useEffect(() => {
    fetchReview();
  }, [range]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const res = await financialAnalysis(range);
      setReview(res?.review || "");
    } catch (error) {
      console.log("fetchReview error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Financial Analysis by AI</Text>

      {/* Dropdown */}
      <View style={styles.dropdownWrap}>
        <DropDownPicker
          open={open}
          value={range}
          items={items}
          setOpen={setOpen}
          setValue={setRange} // setRange will receive the selected value
          setItems={setItems}
          placeholder="Analysis by ..."
          placeholderStyle={{ color: "#6b7280", fontWeight: "500" }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropDownContainer}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 12 }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : review ? (
          <Markdown style={markdownStyles}>{review}</Markdown>
        ) : (
          <Text style={styles.emptyText}>No financial review available.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0f2fe", // light blue
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 12,
    textAlign: "center",
  },
  dropdownWrap: {
    zIndex: 1000, // iOS
    ...Platform.select({ android: { elevation: 1000 } }), // Android
    marginBottom: 12,
  },
  dropdown: {
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  dropDownContainer: {
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 6,
  },
  emptyText: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});

const markdownStyles = {
  heading1: { color: "#1e3a8a", fontWeight: "bold", marginBottom: 8 },
  heading2: { color: "#1e40af", fontWeight: "bold", marginTop: 12 },
  text: { color: "#1f2937", fontSize: 15, lineHeight: 22 },
  bullet_list: { marginVertical: 4 },
  ordered_list: { marginVertical: 4 },
  strong: { color: "#0f172a" },
};
