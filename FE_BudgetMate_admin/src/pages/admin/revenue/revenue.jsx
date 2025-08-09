import React, { useEffect, useState } from "react";
import {
  Typography,
  Select,
  Calendar,
  Modal,
  Space,
  Card,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { getRevenueByRange } from "../../../services/apiServices";

// Kích hoạt plugin
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;
const { Option } = Select;

function Revenue() {
  const [analytics, setAnalytics] = useState(null);
  const [range, setRange] = useState("WEEKLY");
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchRevenueAnalytics();
  }, [range]);

  const fetchRevenueAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getRevenueByRange(range);
      setAnalytics(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const dateCellRender = (value) => {
    if (!analytics) return null;

    const currentDate = value.format("YYYY-MM-DD");

    const isInRange =
      dayjs(currentDate).isSameOrAfter(dayjs(analytics.startDate), "day") &&
      dayjs(currentDate).isSameOrBefore(dayjs(analytics.endDate), "day");

    if (!isInRange) return null;

    return (
      <div style={{ position: "relative", height: "100%" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#e6f7ff",
            borderRadius: 6,
            cursor: "pointer",
          }}
          onClick={() => handleDayClick(currentDate)}
        />
      </div>
    );
  };

  const handleDayClick = (date) => {
    const dayData = analytics?.dailyBreakdown.find((d) => d.date === date);
    if (dayData) {
      setSelectedDay(dayData);
      setModalVisible(true);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Space
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Title level={3}>Revenue Analytics</Title>
        <Select value={range} onChange={setRange} style={{ width: 150 }}>
          <Option value="WEEKLY">Weekly</Option>
          <Option value="MONTHLY">Monthly</Option>
        </Select>
      </Space>

      {analytics && (
        <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
          {`From ${dayjs(analytics.startDate).format(
            "MMM DD, YYYY"
          )} to ${dayjs(analytics.endDate).format("MMM DD, YYYY")}`}
        </Text>
      )}

      <Calendar
        loading={loading}
        dateCellRender={dateCellRender}
        fullscreen={true}
      />

      <Modal
        title={null}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        bodyStyle={{ padding: "20px", backgroundColor: "#f9f9f9" }}
      >
        {selectedDay && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: "10px", color: "#1677ff" }}>
              {dayjs(selectedDay.date).format("MMMM DD, YYYY")}
            </h2>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card
                  bordered
                  style={{ borderRadius: "10px", textAlign: "center" }}
                >
                  <h3 style={{ marginBottom: "5px" }}>Revenue</h3>
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#52c41a",
                    }}
                  >
                    {selectedDay.revenue.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  bordered
                  style={{ borderRadius: "10px", textAlign: "center" }}
                >
                  <h4>Transactions</h4>
                  <p style={{ fontSize: "18px", fontWeight: "500" }}>
                    {selectedDay.transactionCount}
                  </p>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  bordered
                  style={{ borderRadius: "10px", textAlign: "center" }}
                >
                  <h4>Users</h4>
                  <p style={{ fontSize: "18px", fontWeight: "500" }}>
                    {selectedDay.userCount}
                  </p>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Revenue;
