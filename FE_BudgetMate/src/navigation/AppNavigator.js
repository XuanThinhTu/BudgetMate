import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/welcome/welcome";
import LoginScreen from "../screens/authen/login/login";
import RegisterScreen from "../screens/authen/regis/register";
import ConfirmScreen from "../screens/authen/confirm/confirm";
import SetupScreen from "../screens/authen/setup/setup";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import SavingScreen from "../screens/fin-tool/saving/saving";
import DebtScreen from "../screens/fin-tool/debt/debt";
import BudgetScreen from "../screens/fin-tool/budget/budget";
import AddBudgetScreen from "../screens/fin-tool/budget/add-budget/addBudget";
import Wallet from "../screens/wallet-setup/wallet";
import AddTransactionScreen from "../screens/add-trans/addTrans";
import TransDetails from "../screens/trans-details/transDetails";
import QuizScreen from "../screens/quiz/quiz";
import Forgot from "../screens/authen/forgot/forgot";
import NotificationScreen from "../screens/noti/notification";
import MembershipScreen from "../screens/membership/membership";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Forgot" component={Forgot} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Confirm" component={ConfirmScreen} />
        <Stack.Screen name="Setup" component={SetupScreen} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="AddTrans" component={AddTransactionScreen} />
        <Stack.Screen name="TransDetails" component={TransDetails} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Membership" component={MembershipScreen} />
        <Stack.Screen name="Home" component={BottomTabNavigator} />
        <Stack.Screen
          name="SavingsScreen"
          component={SavingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DebtScreen"
          component={DebtScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BudgetScreen"
          component={BudgetScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddBudgetScreen"
          component={AddBudgetScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
