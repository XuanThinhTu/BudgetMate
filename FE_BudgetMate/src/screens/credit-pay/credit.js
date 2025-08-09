import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  getAllPurchasableFeatures,
  getAuthenticatedUser,
  getCurrentSubcription,
  purchaseFeature,
} from "../../services/apiServices";
import Toast from "react-native-toast-message";

export default function CreditScreen({ navigation }) {
  const [feats, setFeats] = useState([]);
  const [currentPackage, setCurrentPackage] = useState("");
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllFeats();
    fecthCurrentSubcription();
    fetchUserCredits();
  }, []);

  const fetchAllFeats = async () => {
    try {
      const res = await getAllPurchasableFeatures();
      setFeats(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fecthCurrentSubcription = async () => {
    try {
      const res = await getCurrentSubcription();
      setCurrentPackage(res.membershipPlan.name);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserCredits = async () => {
    try {
      const res = await getAuthenticatedUser();
      setCredits(res?.credits);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePurchaseFeature = async (id) => {
    try {
      const res = await purchaseFeature(id);

      if (res) {
        Toast.show({
          type: "success",
          text1: "Purchase feature success!",
        });
        navigation.navigate("Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Purchase feature failed!",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  const visibleFeatures = feats.filter((feat) =>
    feat.targetMembershipPlans.includes(currentPackage)
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🎯 Available Features</Text>

      <View style={styles.creditsBox}>
        <Text style={styles.creditsText}>
          💰 Your Credits: <Text style={styles.creditsValue}>{credits}</Text>
        </Text>
      </View>

      {visibleFeatures.map((feat) => (
        <View key={feat.id} style={styles.featureCard}>
          <Text style={styles.featureName}>{feat.featureName}</Text>
          <Text style={styles.featureDescription}>{feat.description}</Text>

          <View style={styles.infoBox}>
            <View style={styles.featureInfoRow}>
              <Text style={styles.label}>💳 Credit Price</Text>
              <Text style={styles.value}>{feat.creditPrice} credits</Text>
            </View>
            <View style={styles.featureInfoRow}>
              <Text style={styles.label}>🔄 Usage Limit</Text>
              <Text style={styles.value}>{feat.usageLimit}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => handlePurchaseFeature(feat.id)}
          >
            <Text style={styles.buyButtonText}>Buy Feature</Text>
          </TouchableOpacity>
        </View>
      ))}

      {visibleFeatures.length === 0 && (
        <Text style={styles.noFeaturesText}>
          🚫 No purchasable features available for your current package.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff", // nền trắng
    minHeight: "100%",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d6efd",
    marginBottom: 20,
    textAlign: "center",
  },
  featureCard: {
    backgroundColor: "#e6f0ff", // xanh dương nhẹ
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#0d6efd",
  },
  featureDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  featureInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#555",
  },
  value: {
    fontSize: 14,
    color: "#0d6efd",
  },
  buyButton: {
    backgroundColor: "#198754",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noFeaturesText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
    color: "#777",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  creditsBox: {
    backgroundColor: "#e6f0ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 16,
  },
  creditsText: {
    fontSize: 14,
    color: "#0d6efd",
    fontWeight: "500",
  },
  creditsValue: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#0d6efd",
  },
});
