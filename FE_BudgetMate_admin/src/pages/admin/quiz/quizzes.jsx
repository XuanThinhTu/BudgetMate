import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Tag,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  addNewQuestion,
  deleteQuestion,
  getAllQuizzes,
  updateQuestion,
} from "../../../services/apiServices";
import toast from "react-hot-toast";

const { Title } = Typography;

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [answerFields, setAnswerFields] = useState([0, 1]);
  const [isEditing, setIsEditing] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const fetchAllQuestions = async () => {
    try {
      const res = await getAllQuizzes();
      setQuizzes(res?.content || []);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditRecord(null);
    form.resetFields();
    setAnswerFields([0, 1]);
  };

  const handleAddAnswerField = () => {
    if (answerFields.length >= 5) {
      message.warning("Maximum 5 answers allowed.");
      return;
    }
    setAnswerFields([...answerFields, answerFields.length]);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditRecord(record);
    setIsModalOpen(true);

    const answerFieldsInit = record.answers.map((_, index) => index);
    setAnswerFields(answerFieldsInit);

    const initialValues = {
      question: record.questionText,
    };

    record.answers.forEach((ans, index) => {
      initialValues[`answer_${index}`] = ans.answerText;
      if (ans.isCorrect) {
        setCorrectAnswerIndex(index);
      }
    });

    form.setFieldsValue(initialValues);
  };

  const handleDelete = async (record) => {
    try {
      const res = await deleteQuestion(record.id);
      if (res) {
        toast.success("Delete question success!");
        fetchAllQuestions();
      } else {
        toast.error("Delete question failed!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formattedAnswers = answerFields.map((index, i) => {
        const base = {
          answerText: values[`answer_${index}`],
          displayOrder: i + 1,
          isCorrect: i === correctAnswerIndex,
          isActive: true,
        };

        if (isEditing && editRecord?.answers?.[i]?.id) {
          base.id = editRecord.answers[i].id;
        }

        return base;
      });

      const payload = {
        questionText: values.question,
        answers: formattedAnswers,
      };

      if (isEditing) {
        console.log(payload);
        const res = await updateQuestion(editRecord.id, payload);
        if (res) {
          toast.success("Update question success!");
          fetchAllQuestions();
        } else {
          toast.error("Add new question failed!");
        }
      } else {
        const res = await addNewQuestion(payload);
        if (res) {
          toast.success("Add new question success!");
          fetchAllQuestions();
        } else {
          toast.error("Add new question failed!");
        }
      }

      handleCancel();
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Question",
      dataIndex: "questionText",
      key: "questionText",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Answers",
      dataIndex: "answers",
      key: "answers",
      render: (answers) =>
        answers?.map((ans) => (
          <div key={ans.id}>
            <Tag color="blue">{`(${ans.displayOrder}) ${ans.answerText}`}</Tag>
          </div>
        )),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Update
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: 24 }} bordered={false} bodyStyle={{ padding: 24 }}>
      <Space
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Quizzes
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Add Question
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={quizzes}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        bordered
      />

      <Modal
        title={isEditing ? "Update Question" : "Add New Question"}
        visible={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText={isEditing ? "Update" : "Submit"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: "Please enter the question" }]}
          >
            <Input.TextArea placeholder="Enter question text" />
          </Form.Item>

          <Title level={5}>Answers</Title>
          {answerFields.map((fieldIndex, idx) => (
            <Form.Item
              key={fieldIndex}
              label={
                <Space>
                  Answer {idx + 1}
                  <input
                    type="checkbox"
                    checked={correctAnswerIndex === idx}
                    onChange={() => setCorrectAnswerIndex(idx)}
                    style={{ transform: "scale(1.2)", marginLeft: 8 }}
                  />
                  <span style={{ fontSize: 12, color: "#888" }}>
                    Correct Answer
                  </span>
                </Space>
              }
              name={`answer_${fieldIndex}`}
              rules={[{ required: true, message: "Please enter this answer" }]}
            >
              <Input placeholder={`Enter answer ${idx + 1}`} />
            </Form.Item>
          ))}

          {answerFields.length < 5 && (
            <Button
              type="dashed"
              onClick={handleAddAnswerField}
              block
              icon={<PlusOutlined />}
            >
              Add Answer
            </Button>
          )}
        </Form>
      </Modal>
    </Card>
  );
}

export default Quizzes;
