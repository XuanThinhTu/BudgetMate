import React from "react";
import { Card, Typography, Row, Col, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import logo from "../../../assets/logo/logo.png";

const { Title, Paragraph } = Typography;

function ResetSuccess() {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "100vh", background: "#f0f2f5" }}
    >
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card
          bordered
          style={{ textAlign: "center", padding: "30px", borderRadius: "10px" }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ height: "50px", marginBottom: "20px" }}
          />

          <CheckCircleOutlined
            style={{ fontSize: "40px", color: "#52c41a", marginBottom: "10px" }}
          />

          <Title level={3}>Password Reset Successfully</Title>

          <Paragraph>
            Thank you! Your password has been updated. <br />
            Please be careful with your credentials and avoid sharing them with
            anyone.
          </Paragraph>

          <Paragraph strong>
            Kindly open the mobile app and login with your new password.
          </Paragraph>
        </Card>
      </Col>
    </Row>
  );
}

export default ResetSuccess;
