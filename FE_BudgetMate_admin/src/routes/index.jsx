import { Route, Routes } from "react-router";
import Login from "../pages/authen/login/login";
import AdminDashboard from "../pages/admin/admin";
import Dashboard from "../pages/admin/dashboard/dashboard";
import Revenue from "../pages/admin/revenue/revenue";
import UserManagement from "../pages/admin/user-management/user_management";
import UserDetails from "../pages/admin/user-management/user-details/user_details";
import Membership from "../pages/admin/membership/membership";
import Verify from "../pages/user/verify/verify";
import Success from "../pages/user/success/success";
import Quizzes from "../pages/admin/quiz/quizzes";
import ResetPass from "../pages/user/reset-pass/resetPass";
import ResetSuccess from "../pages/user/reset-success/resetSuccess";

export default function AppNavigator() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/success" element={<Success />} />
      <Route path="/reset/password" element={<ResetPass />} />
      <Route path="/reset-success" element={<ResetSuccess />} />

      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="membership" element={<Membership />} />
        <Route path="quizzes" element={<Quizzes />} />
      </Route>
    </Routes>
  );
}
