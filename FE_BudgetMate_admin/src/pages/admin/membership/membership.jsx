import React, { useEffect, useState } from "react";
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
  Tag,
  Typography,
  Divider,
  Switch,
} from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  addNewMembership,
  deleteMembership,
  getAllFeatures,
  getAllMemberships,
  updateMembership,
} from "../../../services/apiServices";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const { Option } = Select;
const { Title, Text } = Typography;

const Membership = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const selectedFeatureIds = Form.useWatch("features", form);

  useEffect(() => {
    fetchAllMemberships();
    fetchAllFeatures();
  }, []);

  const fetchAllMemberships = async () => {
    try {
      const res = await getAllMemberships();
      const formatted = res.map((pkg) => ({
        ...pkg,
        key: pkg.id,
      }));
      setPackages(formatted);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllFeatures = async () => {
    try {
      const res = await getAllFeatures();
      setFeatures(res);
    } catch (error) {
      console.log(error);
    }
  };

  const showEditModal = (pkg) => {
    if (pkg) {
      setIsEditing(true);
      const featureSettings = {};
      const selectedFeatureIds = [];

      pkg.features?.forEach((f) => {
        const id = f.feature?.id;
        if (id != null) {
          selectedFeatureIds.push(id);
          featureSettings[id] = {
            limitValue: f.limitValue,
            description: f.description,
            isEnabled: f.isEnabled,
          };
        }
      });

      form.setFieldsValue({
        name: pkg.name,
        description: pkg.description,
        duration: pkg.duration,
        price: pkg.price,
        status: pkg.status,
        type: pkg.type || "MONTHLY",
        features: selectedFeatureIds,
        featureSettings,
      });
    } else {
      setIsEditing(false);
      form.resetFields();
    }

    setSelectedPackage(pkg);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        description: values.description,
        duration: values.duration,
        price: values.price,
        status: values.status,
        type: values.type,
        features: values.features.map((id) => ({
          featureId: id,
          limitValue: values.featureSettings?.[id]?.limitValue || 0,
          description: values.featureSettings?.[id]?.description || "",
          isEnabled: values.featureSettings?.[id]?.isEnabled ?? true,
        })),
      };

      if (isEditing && selectedPackage?.id) {
        const res = await updateMembership(selectedPackage?.id, payload);

        if (res) {
          toast.success("Update membership success!");
          fetchAllMemberships();
        } else {
          toast.error("Update membership failed!");
        }
      } else {
        const res = await addNewMembership(payload);

        if (res) {
          toast.success("Add membership success!");
          fetchAllMemberships();
        } else {
          toast.error("Add membership failed!");
        }
      }

      fetchAllMemberships();
      setModalVisible(false);
      setSelectedPackage(null);
      form.resetFields();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteMembership(id);

      if (res) {
        toast.success("Delete membership success!");
        fetchAllMemberships();
      } else {
        toast.error("Delete membership failed!");
      }

      setModalVisible(false);
      setSelectedPackage(null);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const renderFeatureList = (features) => (
    <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
      {features?.map((f, idx) => (
        <li key={idx} style={{ marginBottom: 8 }}>
          <Text>
            <strong>{f.feature?.name || "Unnamed Feature"}</strong>
            {f.description ? ` - ${f.description}` : ""}
          </Text>
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Membership Packages
        </Title>
      </div>

      <Row gutter={[24, 24]} align="stretch">
        {packages.map((pkg) => (
          <Col key={pkg.key} span={8}>
            <Card
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong>{pkg.name}</Text>
                  <Tag color={pkg.status === "ACTIVE" ? "green" : "red"}>
                    {pkg.status}
                  </Tag>
                </div>
              }
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => showEditModal(pkg)}
                  block
                >
                  Edit
                </Button>,
              ]}
            >
              <Text type="secondary">Description:</Text>
              <Text style={{ marginBottom: 8 }}>{pkg.description}</Text>

              <Text type="secondary">Duration:</Text>
              <Text style={{ marginBottom: 8 }}>{pkg.duration} months</Text>

              <Text type="secondary">Price:</Text>
              <Text style={{ marginBottom: 8 }}>{pkg.price} VND</Text>

              <Divider style={{ margin: "12px 0" }} />
              <Text strong>Features</Text>
              {renderFeatureList(pkg.features)}
            </Card>
          </Col>
        ))}

        <Col span={8}>
          <Card
            hoverable
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px dashed #d9d9d9",
            }}
            onClick={() => showEditModal(null)}
          >
            <Button type="dashed" icon={<PlusOutlined />} size="large">
              Add Package
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
        footer={[
          selectedPackage && (
            <Button
              danger
              key="delete"
              onClick={() => handleDelete(selectedPackage?.id)}
              icon={<DeleteOutlined />}
            >
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
            rules={[{ required: true, message: "Please enter package name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Duration (months)"
            name="duration"
            rules={[{ required: true, message: "Please enter duration" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Price (VND)"
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select type" }]}
          >
            <Select placeholder="Select type">
              <Option value="MONTHLY">Monthly</Option>
              <Option value="YEARLY">Yearly</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Features"
            name="features"
            rules={[{ required: true, message: "Please select features" }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select features"
              optionFilterProp="label"
            >
              {features.map((f) => (
                <Option key={f.id} value={f.id} label={f.name}>
                  {f.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* 👇 Render settings for each selected feature */}
          {selectedFeatureIds?.map((featureId) => {
            const feature = features.find((f) => f.id === featureId);
            return (
              <div
                key={featureId}
                style={{
                  padding: "12px",
                  marginBottom: 12,
                  border: "1px dashed #ccc",
                  borderRadius: 4,
                }}
              >
                <Text strong>{feature?.name}</Text>
                <Form.Item
                  name={["featureSettings", featureId, "limitValue"]}
                  label="Limit Value"
                  rules={[
                    {
                      required: true,
                      message: "Please enter limit value",
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name={["featureSettings", featureId, "description"]}
                  label="Description"
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item
                  name={["featureSettings", featureId, "isEnabled"]}
                  label="Is Enabled"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </div>
            );
          })}
        </Form>
      </Modal>
    </div>
  );
};

export default Membership;
