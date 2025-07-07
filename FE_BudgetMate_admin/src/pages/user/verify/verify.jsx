import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, Typography, Layout } from "antd";
import logo from "../../../assets/logo/logo.png";
import { verifyUserFunction } from "../../../services/apiServices";
import toast from "react-hot-toast";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleVerify = async (userToken) => {
    try {
      const res = await verifyUserFunction(userToken);

      if (res) {
        toast.success("Verify success!");
        navigate("/success");
      } else {
        toast.error("Verify failed!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
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
            width: 420,
            textAlign: "center",
            padding: "32px 24px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "16px",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: "120px", marginBottom: "24px" }}
          />
          <Title level={3}>Account Verification</Title>
          <Paragraph>
            Thank you for registering! Please click the button below to verify
            your email address and activate your account.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            onClick={() => handleVerify(token)}
            disabled={!token}
            style={{ marginTop: "20px", width: "100%" }}
          >
            Verify
          </Button>
        </Card>
      </Content>
    </Layout>
  );
}

export default Verify;
