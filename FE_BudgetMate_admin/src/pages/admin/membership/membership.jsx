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
} from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAllFeatures,
  getAllMemberships,
} from "../../../services/apiServices";
import { useNavigate } from "react-router";

const { Option } = Select;
const { Title, Text } = Typography;

const Membership = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

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
        features: pkg.features,
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
    setSelectedPackage(pkg);
    form.setFieldsValue({
      ...pkg,
      features: pkg?.features?.map((f) => f.id),
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const selectedFeatures = features.filter((f) =>
        values.features.includes(f.id)
      );

      const updated = {
        ...values,
        key: selectedPackage?.key || values.name.toLowerCase(),
        features: selectedFeatures, // lưu object đầy đủ để hiển thị đẹp
      };

      const newList = selectedPackage
        ? packages.map((pkg) =>
            pkg.key === selectedPackage.key ? updated : pkg
          )
        : [...packages, updated];

      setPackages(newList);
      setModalVisible(false);
      setSelectedPackage(null);
      form.resetFields();
    });
  };

  const handleDelete = () => {
    if (selectedPackage) {
      setPackages((prev) =>
        prev.filter((pkg) => pkg.key !== selectedPackage.key)
      );
      setModalVisible(false);
      setSelectedPackage(null);
      form.resetFields();
    }
  };

  const renderFeatureList = (features) => (
    <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
      {features?.map((f, idx) => (
        <li key={idx} style={{ marginBottom: 8 }}>
          <Text>
            <strong>{f.name}</strong>
            {f.description ? `  ${f.description}` : ""}
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
        <Button type="primary" onClick={() => navigate("/admin/features")}>
          Features Management
        </Button>
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
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <Text type="secondary">Description:</Text>
                <Text style={{ marginBottom: 8 }}>{pkg.description}</Text>

                <Text type="secondary">Duration:</Text>
                <Text style={{ marginBottom: 8 }}>{pkg.duration} days</Text>

                <Text type="secondary">Price:</Text>
                <Text style={{ marginBottom: 8 }}>${pkg.price}</Text>

                <Divider style={{ margin: "12px 0" }} />
                <Text strong>Features</Text>
                {renderFeatureList(pkg.features)}
              </div>
            </Card>
          </Col>
        ))}

        {/* Add new card */}
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

      {/* Modal */}
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
              onClick={handleDelete}
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
            label="Duration (days)"
            name="duration"
            rules={[{ required: true, message: "Please enter duration" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Price ($)"
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Features"
            name="features"
            rules={[
              { required: true, message: "Please select at least one feature" },
            ]}
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
        </Form>
      </Modal>
    </div>
  );
};

export default Membership;
