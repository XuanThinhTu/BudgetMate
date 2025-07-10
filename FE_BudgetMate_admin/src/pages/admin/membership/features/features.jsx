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
import {
  addNewFeature,
  deleteFeature,
  getAllFeatures,
  updateFeature,
} from "../../../../services/apiServices";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const { Title } = Typography;
const { Search } = Input;

function Features() {
  const [features, setFeatures] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
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
      setFilteredFeatures(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
    const keyword = value.toLowerCase();
    const filtered = features.filter(
      (f) =>
        f.name.toLowerCase().includes(keyword) ||
        f.description.toLowerCase().includes(keyword)
    );
    setFilteredFeatures(filtered);
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

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing && editingFeature) {
        const updateValue = { ...values };
        const res = await updateFeature(editingFeature.id, updateValue);

        if (res) {
          toast.success("Update feature success!");
          fetchAllFeatures();
        } else {
          toast.error("Update feature failed!");
        }
      } else {
        const newFeature = { ...values };
        const res = await addNewFeature(newFeature);

        if (res) {
          toast.success("Add feature success!");
          fetchAllFeatures();
        } else {
          toast.error("Add feature failed!");
        }
      }
      setIsModalOpen(false);
      setEditingFeature(null);
      form.resetFields();
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteFeature(id);

      if (res) {
        toast.success("Delete feature success!");
        fetchAllFeatures();
      } else {
        toast.error("Delete feature failed!");
      }
    } catch (error) {
      console.log(error);
    }
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

      {/* 🔍 Search Bar */}
      <Search
        placeholder="Search by name or description"
        allowClear
        value={searchKeyword}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />

      <Table
        dataSource={filteredFeatures}
        columns={columns}
        rowKey="id"
        bordered
        pagination={false}
      />

      {/* 📦 Add/Edit Modal */}
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
