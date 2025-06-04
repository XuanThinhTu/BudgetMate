import { Route, Routes } from "react-router";
import Login from "../pages/authen/login/login";
import AdminDashboard from "../pages/admin/admin";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
    </Routes>
  );
}

export default function AppNavigator() {
  return (
    <Routes>
      <Route path="/*" element={<AppRouter />} />
      <Route path="/admin" element={<AdminRouter />} />
    </Routes>
  );
}
