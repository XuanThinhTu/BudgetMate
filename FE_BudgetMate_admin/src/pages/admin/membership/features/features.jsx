import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Tag,
  Typography,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { getAllFeatures } from "../../../../services/apiServices";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function Features() {
  const [features, setFeatures] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllFeatures();
  }, []);

  const fetchAllFeatures = async () => {
    try {
      const res = await getAllFeatures();
      setFeatures(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setEditingFeature(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditClick = (feature) => {
    setIsEditing(true);
    setEditingFeature(feature);
    form.setFieldsValue(feature);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (isEditing && editingFeature) {
        const updated = features.map((f) =>
          f.id === editingFeature.id ? { ...f, ...values } : f
        );
        setFeatures(updated);
        message.success("Feature updated successfully");
      } else {
        const newFeature = {
          ...values,
          id: Date.now(),
        };
        setFeatures((prev) => [...prev, newFeature]);
        message.success("Feature added successfully");
      }

      setIsModalOpen(false);
      setEditingFeature(null);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    setFeatures(features.filter((f) => f.id !== id));
    message.success("Feature deleted");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 180,
    },
    {
      title: "Feature Key",
      dataIndex: "featureKey",
      render: (key) => <code>{key}</code>,
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 100,
      render: (active) =>
        active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => handleEditClick(record)}
          />
          <Popconfirm
            title="Are you sure to delete this feature?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} type="text" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Features List
        </Title>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/membership")}
          >
            Back to Memberships
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClick}
          >
            Add Feature
          </Button>
        </Space>
      </Space>

      <Table
        dataSource={features}
        columns={columns}
        rowKey="id"
        bordered
        pagination={false}
      />

      <Modal
        title={isEditing ? "Edit Feature" : "Add Feature"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSave}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Feature Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="e.g., Create Wallet" />
          </Form.Item>

          <Form.Item
            label="Feature Key"
            name="featureKey"
            rules={[{ required: true, message: "Please enter a key" }]}
          >
            <Input placeholder="e.g., CREATE_WALLET" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={3} placeholder="Describe this feature..." />
          </Form.Item>

          <Form.Item
            label="Is Active"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Features;
