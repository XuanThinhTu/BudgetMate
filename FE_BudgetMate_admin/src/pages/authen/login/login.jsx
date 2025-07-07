import React from "react";
import { Form, Input, Button, Checkbox, Typography, Card } from "antd";
import logo from "../../../assets/logo/logo.png";
import { loginFunction } from "../../../services/apiServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const { Title } = Typography;

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await loginFunction(values);
      if (res) {
        toast.success("Login success!");
        sessionStorage.setItem("token", res?.accessToken);
        navigate("/admin");
      } else {
        toast.error("Login failed!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
        padding: "20px",
      }}
    >
      <Card
        style={{ width: 360, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        bordered={false}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "100px", marginBottom: 16 }}
          />
          <Title level={3}>Admin Login</Title>
        </div>

        <Form
          form={form}
          name="loginForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log In
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
            <a href="/forgot-password">Forgot password?</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
