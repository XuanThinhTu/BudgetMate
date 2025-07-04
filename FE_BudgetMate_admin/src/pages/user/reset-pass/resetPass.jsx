import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Form, Input, Button, Card, Typography, Row, Col } from "antd";
import logo from "../../../assets/logo/logo.png";
import { resetPassword } from "../../../services/apiServices";

const { Title } = Typography;

function ResetPass() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      const { password, confirmPassword } = values;
      const reset = {
        token: token,
        newPassword: password,
      };

      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      const res = await resetPassword(reset);
      if (res) {
        toast.success("Password has been reset successfully!");
        navigate("/reset-success");
      } else {
        toast.error("Reset password failed!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "100vh", background: "#f0f2f5" }}
    >
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card bordered style={{ textAlign: "center", padding: "30px" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: "50px", marginBottom: "20px" }}
          />
          <Title level={3}>Reset Password</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
          >
            <Form.Item
              label="New Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your new password!" },
                { min: 3, message: "Password must be at least 3 characters." },
              ]}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: "Please confirm your password!" },
              ]}
            >
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default ResetPass;
