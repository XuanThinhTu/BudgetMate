import React from "react";
import { Layout, Menu, Typography, theme, Button } from "antd";
import {
  DashboardOutlined,
  PieChartOutlined,
  WalletOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo/logo.png";
import Dashboard from "./dashboard/dashboard";
import Revenue from "./revenue/revenue";
import UserManagement from "./user-management/user_management";
import Analytics from "./analytics/analytics";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "revenue", icon: <WalletOutlined />, label: "Revenue" },
  { key: "analytics", icon: <PieChartOutlined />, label: "Analytics" },
  { key: "users", icon: <UserOutlined />, label: "Users" },
];

function AdminDashboard() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [selectedKey, setSelectedKey] = React.useState("dashboard");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    console.log("Admin logged out");
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "dashboard":
        return <Dashboard />;
      case "revenue":
        return <Revenue />;
      case "analytics":
        return <Analytics />;
      case "users":
        return <UserManagement />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ background: "#002B5B" }}
      >
        <div style={{ height: 64, margin: 16, textAlign: "center" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "100%", maxHeight: 48 }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          items={menuItems}
          style={{ background: "#002B5B" }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#0066CC",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ color: "white", margin: 0 }}>
            Welcome, admin!
          </Title>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminDashboard;
