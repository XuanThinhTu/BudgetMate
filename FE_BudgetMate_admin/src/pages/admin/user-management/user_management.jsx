import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Button, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { getAllUsers } from "../../../services/apiServices";

const { Title } = Typography;

function UserManagement() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  console.log(users);

  const fetchAllUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "ACTIVE" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>User Management</Title>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        onRow={(record) => ({
          onClick: () => navigate(`/admin/users/${record.id}`),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

export default UserManagement;
