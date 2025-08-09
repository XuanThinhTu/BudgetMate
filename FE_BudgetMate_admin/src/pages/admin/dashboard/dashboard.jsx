import React, { useEffect, useState } from "react";
import { Typography, Card, DatePicker, Table, message, Row, Col } from "antd";
import dayjs from "dayjs";
import {
  getRevenueByRange,
  membershipBreakdown,
} from "../../../services/apiServices";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function Dashboard() {
  const [range, setRange] = useState("WEEKLY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [revenue, setRevenue] = useState(0);
  const [membershipData, setMembershipData] = useState([]);

  useEffect(() => {
    fetchRevenue();
  }, [range]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchMembershipBreakdown();
    }
  }, [startDate, endDate]);

  const fetchRevenue = async () => {
    try {
      const res = await getRevenueByRange(range);
      setRevenue(res?.totalRevenue || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMembershipBreakdown = async () => {
    try {
      const res = await membershipBreakdown(startDate, endDate);
      setMembershipData(res || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRangeChange = (dates) => {
    if (!dates) {
      setStartDate("");
      setEndDate("");
      return;
    }
    setStartDate(dayjs(dates[0]).format("YYYY-MM-DD"));
    setEndDate(dayjs(dates[1]).format("YYYY-MM-DD"));
  };

  const columns = [
    {
      title: "Membership Name",
      dataIndex: "membershipName",
      key: "membershipName",
    },
    {
      title: "Revenue (VND)",
      dataIndex: "revenue",
      key: "revenue",
      render: (value) => value.toLocaleString("vi-VN"),
    },
    {
      title: "Subscription Count",
      dataIndex: "subscriptionCount",
      key: "subscriptionCount",
    },
    {
      title: "Average Order Value (VND)",
      dataIndex: "averageOrderValue",
      key: "averageOrderValue",
      render: (value) => value.toLocaleString("vi-VN"),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f0f8ff", minHeight: "100vh" }}>
      <Title level={2} style={{ color: "#0066cc" }}>
        Admin Dashboard
      </Title>

      {/* Total Revenue */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card
            style={{
              backgroundColor: "#e6f7ff",
              borderColor: "#91d5ff",
              textAlign: "center",
            }}
          >
            <Title level={4} style={{ color: "#1890ff" }}>
              Total Revenue
            </Title>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#003a8c" }}
            >
              {revenue.toLocaleString("vi-VN")} VND
            </Text>
          </Card>
        </Col>

        {/* Date Range Picker */}
        <Col span={16}>
          <Card style={{ borderColor: "#91d5ff" }}>
            <Text strong style={{ marginRight: 10 }}>
              Select Date Range:
            </Text>
            <RangePicker
              format="YYYY-MM-DD"
              onChange={handleRangeChange}
              style={{ borderColor: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Membership Breakdown Table */}
      <Card
        style={{ marginTop: 20, borderColor: "#91d5ff" }}
        title="Membership Revenue Breakdown"
      >
        {startDate && endDate ? (
          <Table
            columns={columns}
            dataSource={membershipData}
            rowKey="membershipPlanId"
            pagination={false}
          />
        ) : (
          <Text type="warning">
            Please select a date range to view membership revenue.
          </Text>
        )}
      </Card>
    </div>
  );
}

export default Dashboard;
