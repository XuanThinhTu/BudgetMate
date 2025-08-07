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
  Divider,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  getAllFeatures,
  getAllMemberships,
  getAllPurchasableFeatures,
  addNewPurchasableFeature,
  updatePurchasableFeature,
  deletePurchasableFeature,
} from "../../../services/apiServices";
import toast from "react-hot-toast";

const { Title } = Typography;
const { Search } = Input;

function Features() {
  const [features, setFeatures] = useState([]);
  const [purchasableFeats, setPurchasableFeats] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAllFeatures();
    fetchAllPurchasableFeatures();
    fetchAllMemberships();
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

  const fetchAllPurchasableFeatures = async () => {
    try {
      const res = await getAllPurchasableFeatures();
      setPurchasableFeats(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllMemberships = async () => {
    try {
      const res = await getAllMemberships();
      setMemberships(res);
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
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing && editingFeature) {
        const updateValue = { ...values };
        const res = await updatePurchasableFeature(
          editingFeature.id,
          updateValue
        );

        if (res) {
          toast.success("Update feature success!");
          fetchAllPurchasableFeatures();
        } else {
          toast.error("Update feature failed!");
        }
      } else {
        const newFeature = { ...values };
        const res = await addNewPurchasableFeature(newFeature);

        if (res) {
          toast.success("Add feature success!");
          fetchAllPurchasableFeatures();
        } else {
          toast.error("Add feature failed!");
        }
      }

      setIsModalOpen(false);

      form.resetFields();
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleEditPurchasableFeature = (record) => {
    setIsEditing(true);
    setIsModalOpen(true);
    setEditingFeature(record);

    form.setFieldsValue({
      featureId: features.find((f) => f.name === record.featureName)?.id,
      creditPrice: record.creditPrice,
      usageLimit: record.usageLimit,
      targetMembershipPlans: record.targetMembershipPlans,
      description: record.description,
    });
  };

  const handleDeletePurchasableFeature = async (id) => {
    try {
      const res = await deletePurchasableFeature(id);

      if (res) {
        toast.success("Delete feature success!");
        fetchAllPurchasableFeatures();
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
          Original Features List
        </Title>
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

      <Divider />

      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginTop: 32,
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Purchasable Features List
        </Title>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
          Add Purchasable Feature
        </Button>
      </Space>

      <Table
        dataSource={purchasableFeats}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            width: 60,
          },
          {
            title: "Name",
            dataIndex: "featureName",
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
            title: "Usage Limit",
            dataIndex: "usageLimit",
            width: 120,
            render: (val) => val ?? "-",
          },
          {
            title: "Credit Price",
            dataIndex: "creditPrice",
            width: 120,
          },
          {
            title: "Membership Plans",
            dataIndex: "targetMembershipPlans",
            render: (plans) =>
              plans?.map((p) => (
                <Tag key={p} color="blue">
                  {p}
                </Tag>
              )),
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
            key: "actions",
            width: 100,
            render: (_, record) => (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  onClick={() => handleEditPurchasableFeature(record)}
                />
                <Popconfirm
                  title="Are you sure to delete this feature?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleDeletePurchasableFeature(record.id)}
                >
                  <Button icon={<DeleteOutlined />} type="link" danger />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        rowKey="id"
        bordered
        pagination={false}
      />

      <Modal
        title="Add Purchasable Feature"
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
            label="Feature"
            name="featureId"
            rules={[{ required: true, message: "Please select a feature" }]}
          >
            <Select
              placeholder="Select a feature"
              options={features.map((f) => ({
                label: f.name,
                value: f.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Credit Price"
            name="creditPrice"
            rules={[{ required: true, message: "Please enter credit price" }]}
          >
            <Input type="number" placeholder="e.g., 100" />
          </Form.Item>

          <Form.Item
            label="Usage Limit"
            name="usageLimit"
            rules={[{ required: true, message: "Please enter usage limit" }]}
          >
            <Input type="number" placeholder="e.g., 10" />
          </Form.Item>

          <Form.Item
            label="Target Membership Plans"
            name="targetMembershipPlans"
            rules={[
              { required: true, message: "Please select at least one plan" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select membership plans"
              options={memberships.map((m) => ({
                label: m.name,
                value: m.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={3} placeholder="Describe this feature..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Features;
