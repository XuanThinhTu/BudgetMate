import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  getAllMemberships,
  getCurrentSubcription,
  paymentForNoneBasic,
  paymentForBasic,
} from "../../services/apiServices";
import Toast from "react-native-toast-message";

export default function MembershipScreen() {
  const [packages, setPackages] = useState([]);
  const [currentPackageId, setCurrentPackageId] = useState(0);

  useEffect(() => {
    fetchMemberships();
    fecthCurrentSubcription();
  }, []);

  const fecthCurrentSubcription = async () => {
    try {
      const res = await getCurrentSubcription();
      setCurrentPackageId(res.membershipPlan.id);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMemberships = async () => {
    try {
      const res = await getAllMemberships();
      setPackages(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubscribe = async (membership) => {
    try {
      if (membership.price === 0) {
        const res = await paymentForBasic(membership.id);

        if (res) {
          Toast.show({
            type: "success",
            text1: "Subscribe success!",
          });
          fetchMemberships();
          fecthCurrentSubcription();
        } else {
          Toast.show({
            type: "error",
            text1: "Subscribe failed!",
          });
        }
      } else {
        const res = await paymentForNoneBasic(membership.id);
        Linking.openURL(res.checkoutUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Membership Plans</Text>

      {packages.map((pkg) => (
        <View key={pkg.id} style={styles.card}>
          <Text style={styles.planName}>{pkg.name}</Text>
          <Text style={styles.price}>
            {pkg.price === 0
              ? "Free"
              : `${pkg.price.toLocaleString("vi-VN")}₫ / ${pkg.type}`}
          </Text>
          <Text style={styles.description}>{pkg.description}</Text>

          <Text style={styles.featureTitle}>Included Features:</Text>
          {pkg.features?.length > 0 ? (
            pkg.features.map((f) => (
              <View key={f.id} style={styles.featureItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.featureText}>{f.description}</Text>
              </View>
            ))
          ) : (
            <Text style={{ fontStyle: "italic", color: "#888" }}>
              No features listed.
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              pkg.id === currentPackageId && styles.disabledButton,
            ]}
            onPress={() => handleSubscribe(pkg)}
            disabled={pkg.id === currentPackageId}
          >
            <Text style={styles.buttonText}>
              {pkg.id === currentPackageId ? "Current Plan" : "Subscribe"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#1e3a8a",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: "#0284c7",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 12,
  },
  featureTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
    color: "#334155",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 14,
    marginRight: 6,
    color: "#0284c7",
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#1d4ed8",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#94a3b8",
  },
});
