import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Descriptions,
  Divider,
  Table,
  Avatar,
  Button,
  Empty,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  banUserFunction,
  getAllUsers,
  unbanUserFunction,
} from "../../../../services/apiServices";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await getAllUsers();
      const u = res.find((item) => String(item.id) === id);
      setUser(u);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      const res = await banUserFunction(userId);
      console.log(res);

      if (res) {
        toast.success("Ban user success!");
        fetchUserInfo();
      } else {
        toast.error("Ban user failed!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      const res = await unbanUserFunction(userId);
      console.log(res);

      if (res) {
        toast.success("Activate user success!");
        fetchUserInfo();
      } else {
        toast.error("Activate user failed!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const gameColumns = [
    {
      title: "Play Time",
      dataIndex: "time",
      key: "time",
      render: (text) => dayjs(text).format("HH:mm - DD/MM/YYYY"),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
  ];

  if (!user) return <div>Loading user...</div>;

  return (
    <div style={{ padding: 24, backgroundColor: "#f0f5ff" }}>
      {/* Back Button */}
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/admin/users")}
        style={{ marginBottom: 16 }}
      >
        Back to User Management
      </Button>

      {/* Basic Info */}
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Avatar
              size={120}
              src={user.avatar || null}
              icon={<UserOutlined />}
            />
          </Col>
          <Col span={18}>
            <Title level={3} style={{ color: "#1677ff" }}>
              {user.fullName}
            </Title>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="Address">
                {user.address}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {user.status === "ACTIVE" ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="red">{user.status}</Tag>
                )}
                <Button
                  danger
                  type="primary"
                  size="small"
                  style={{ marginLeft: 8 }}
                  onClick={() =>
                    user.status === "ACTIVE"
                      ? handleBanUser(user?.id)
                      : handleUnbanUser(user?.id)
                  }
                >
                  {user.status === "ACTIVE" ? "Ban User" : "Unban User"}
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {user.roleName}
              </Descriptions.Item>
              <Descriptions.Item label="Credits">
                {user.credits}
              </Descriptions.Item>
              <Descriptions.Item label="Streak Days">
                {user.streakDays}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Game History */}
      <Divider
        orientation="left"
        orientationMargin={0}
        style={{ borderColor: "#1677ff", marginTop: 32 }}
      >
        <CalendarOutlined /> Game History
      </Divider>
      {user.gameHistory && user.gameHistory.length > 0 ? (
        <Table
          dataSource={user.gameHistory}
          columns={gameColumns}
          rowKey={(record, index) => index}
          pagination={{ pageSize: 5 }}
        />
      ) : (
        <Empty description="No game history available" />
      )}
    </div>
  );
};

export default UserDetails;
