import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Table,
  Tag,
  Typography,
} from "antd";

const { Option } = Select;
const { Title } = Typography;

const initialPackages = [
  {
    key: "basic",
    name: "Basic",
    duration: 30,
    price: 5,
    features: ["Basic Budget Tracking"],
    status: "Active",
    revenue: 500,
    subscribers: 100,
  },
  {
    key: "plus",
    name: "Plus",
    duration: 90,
    price: 12,
    features: ["Basic Budget Tracking", "AI Recommendation"],
    status: "Active",
    revenue: 1200,
    subscribers: 150,
  },
  {
    key: "premium",
    name: "Premium",
    duration: 180,
    price: 20,
    features: ["All Plus Features", "Priority Support", "Advanced Analytics"],
    status: "Inactive",
    revenue: 2000,
    subscribers: 80,
  },
];

const Membership = () => {
  const [packages, setPackages] = useState(initialPackages);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showEditModal = (pkg) => {
    setSelectedPackage(pkg);
    form.setFieldsValue(pkg);
    setModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const updatedPackages = selectedPackage
        ? packages.map((pkg) =>
            pkg.key === selectedPackage.key ? { ...pkg, ...values } : pkg
          )
        : [...packages, { ...values, key: values.name.toLowerCase() }];
      setPackages(updatedPackages);
      setModalVisible(false);
      setSelectedPackage(null);
      form.resetFields();
    });
  };

  const handleDelete = () => {
    if (selectedPackage) {
      setPackages(packages.filter((pkg) => pkg.key !== selectedPackage.key));
      setModalVisible(false);
      setSelectedPackage(null);
      form.resetFields();
    }
  };

  const revenueColumns = [
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Revenue ($)",
      dataIndex: "revenue",
      key: "revenue",
    },
    {
      title: "Subscribers",
      dataIndex: "subscribers",
      key: "subscribers",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Membership Packages</Title>
      <Row gutter={16}>
        {packages.map((pkg) => (
          <Col key={pkg.key} span={8}>
            <Card
              title={pkg.name}
              extra={
                <Tag color={pkg.status === "Active" ? "green" : "red"}>
                  {pkg.status}
                </Tag>
              }
              actions={[
                <Button type="link" onClick={() => showEditModal(pkg)}>
                  Edit
                </Button>,
              ]}
            >
              <p>
                <strong>Duration:</strong> {pkg.duration} days
              </p>
              <p>
                <strong>Price:</strong> ${pkg.price}
              </p>
              <p>
                <strong>Features:</strong>
              </p>
              <ul>
                {pkg.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </Card>
          </Col>
        ))}
        <Col span={8}>
          <Card
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button type="dashed" onClick={() => showEditModal(null)} block>
              + Add Package
            </Button>
          </Card>
        </Col>
      </Row>

      <Modal
        title={selectedPackage ? "Edit Package" : "Add Package"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSave}
        okText="Save"
        footer={[
          selectedPackage && (
            <Button danger key="delete" onClick={handleDelete}>
              Delete
            </Button>
          ),
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Package Name"
            name="name"
            rules={[{ required: true, message: "Please input package name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Duration (days)"
            name="duration"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Price ($)"
            name="price"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Features (comma-separated)"
            name="features"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="Example: AI, Budget Tracking"
              onChange={(e) =>
                form.setFieldsValue({
                  features: e.target.value.split(",").map((f) => f.trim()),
                })
              }
            />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Title level={4} style={{ marginTop: 40 }}>
        Package Revenue Summary
      </Title>
      <Table
        columns={revenueColumns}
        dataSource={packages}
        rowKey="key"
        pagination={false}
      />
    </div>
  );
};

export default Membership;
