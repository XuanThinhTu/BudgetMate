import React from "react";
import { Layout, Card, Typography, Button, Result } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import logo from "../../../assets/logo/logo.png";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function Success() {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f6ffed" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
        }}
      >
        <Card
          style={{
            maxWidth: 500,
            textAlign: "center",
            padding: "32px 24px",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#ffffff",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: "100px", marginBottom: "24px" }}
          />

          <CheckCircleTwoTone
            twoToneColor="#52c41a"
            style={{ fontSize: "64px", marginBottom: "16px" }}
          />

          <Title level={3}>Email Verified Successfully</Title>

          <Paragraph>
            Thank you for verifying your email. Your account is now activated.
          </Paragraph>

          <Paragraph strong>
            Please open the app to log in and get started.
          </Paragraph>

          <Button
            type="primary"
            size="large"
            style={{ marginTop: "20px", width: "100%" }}
            href="yourapp://login"
          >
            Open App
          </Button>
        </Card>
      </Content>
    </Layout>
  );
}

export default Success;
