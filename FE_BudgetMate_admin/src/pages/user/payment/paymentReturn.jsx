import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Result, Spin } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import logo from "../../../assets/logo/logo.png";
import { getPaymentStatus } from "../../../services/apiServices";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const stat = searchParams.get("status");

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderCode && stat) {
      fetchPaymentStatus(orderCode, stat);
    }
  }, [orderCode, stat]);

  const fetchPaymentStatus = async (code, stat) => {
    try {
      const res = await getPaymentStatus(code, stat);
      console.log(res);
      if (res.success) {
        setStatus("COMPLETED");
      } else {
        setStatus("ERROR");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const successDescription = (
    <span>
      Thank you for your payment and support for <strong>BudgetMate</strong>!{" "}
      Your transaction was successful. Please return to the mobile app to check
      your updated membership package and enjoy all the premium features.
    </span>
  );

  const failDescription = (
    <span>
      Unfortunately, your payment could not be processed. Please verify your
      transaction details and try again. If the problem persists, contact our{" "}
      <strong>BudgetMate</strong> support team.
    </span>
  );

  const renderResult = () => {
    if (status === "COMPLETED") {
      return (
        <Result
          icon={
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 64 }}
            />
          }
          title="Payment Successful!"
          subTitle={successDescription}
        />
      );
    } else if (status === "ERROR") {
      return (
        <Result
          status="error"
          icon={
            <CloseCircleTwoTone
              twoToneColor="#ff4d4f"
              style={{ fontSize: 64 }}
            />
          }
          title="Payment Failed"
          subTitle={failDescription}
        />
      );
    }
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="BudgetMate Logo" style={styles.logo} />
      <h2 style={styles.title}>BudgetMate</h2>
      {loading ? <Spin size="large" /> : renderResult()}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "40px 20px",
    maxWidth: 600,
    margin: "0 auto",
  },
  logo: {
    height: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#1d4ed8",
  },
};

export default PaymentReturn;
