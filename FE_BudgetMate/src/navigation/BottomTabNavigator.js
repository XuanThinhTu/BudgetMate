import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfileScreen from "../screens/profile/profile";
import HomeScreenMain from "../screens/home/home";
import TransactionScreen from "../screens/transaction/transaction";
import AddTransactionScreen from "../screens/add-trans/addTrans";
import FinancialToolsScreen from "../screens/fin-tool/financialTool";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1d4ed8",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Transaction":
              iconName = "card-outline";
              break;
            case "Add":
              iconName = "add-circle";
              break;
            case "Tools":
              iconName = "construct-outline";
              break;
            case "Profile":
              iconName = "person";
              break;
            default:
              iconName = "home";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreenMain} />
      <Tab.Screen name="Transaction" component={TransactionScreen} />
      <Tab.Screen name="Add" component={AddTransactionScreen} />
      <Tab.Screen name="Tools" component={FinancialToolsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
