import React from "react";
import { Layout, Menu, Typography, theme, Button } from "antd";
import {
  DashboardOutlined,
  ReadOutlined,
  WalletOutlined,
  UserOutlined,
  LogoutOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo/logo.png";
import { Outlet, useNavigate } from "react-router";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "revenue", icon: <WalletOutlined />, label: "Revenue" },
  { key: "users", icon: <UserOutlined />, label: "Users" },
  { key: "membership", icon: <IdcardOutlined />, label: "Membership" },
  { key: "quizzes", icon: <ReadOutlined />, label: "Quizzes" },
];

function AdminDashboard() {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
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
          selectedKeys={[location.pathname.split("/")[2] || "dashboard"]}
          onClick={({ key }) => navigate(`/admin/${key}`)}
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
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminDashboard;
