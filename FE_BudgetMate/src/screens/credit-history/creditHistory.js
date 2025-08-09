import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getPurchasedFeatures } from "../../services/apiServices";

export default function CreditHistoryScreen() {
  const [feats, setFeats] = useState([]);

  useEffect(() => {
    fetchAllPurchasedFeats();
  }, []);

  const fetchAllPurchasedFeats = async () => {
    try {
      const res = await getPurchasedFeatures();
      setFeats(res);
    } catch (error) {
      console.log(error);
    }
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerText]}>Feature Name</Text>
      <Text style={[styles.cell, styles.headerText]}>Description</Text>
      <Text style={[styles.cell, styles.headerText]}>Remaining Usage</Text>
      <Text style={[styles.cell, styles.headerText]}>Last Used</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.featureName}</Text>
      <Text style={styles.cell}>{item.description}</Text>
      <Text style={styles.cell}>{item.remainingUsage}</Text>
      <Text style={styles.cell}>{item.lastUsedAt ?? "Not used"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purchased Features</Text>

      {feats.length === 0 ? (
        <Text style={styles.emptyText}>
          You have not purchased any features yet.
        </Text>
      ) : (
        <>
          {renderHeader()}
          <FlatList
            data={feats}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F0FA", // xanh dương nhạt
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1A73E8", // xanh dương đậm hơn
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  headerRow: {
    backgroundColor: "#B3D4FC", // xanh dương nhạt cho header
  },
  cell: {
    flex: 1,
    paddingHorizontal: 6,
    fontSize: 13,
    color: "#333",
  },
  headerText: {
    fontWeight: "bold",
    color: "#0D47A1",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#0D47A1",
  },
});
