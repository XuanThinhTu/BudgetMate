import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getUserDailyQuizzes, submitAnswer } from "../../services/apiServices";

export default function QuizScreen({ navigation }) {
  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyQuizzes();
  }, []);

  const fetchDailyQuizzes = async () => {
    try {
      const res = await getUserDailyQuizzes();
      setQuizzes(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (answer) => {
    if (showResult) return;

    setSelectedAnswerId(answer.id);

    const payload = {
      questionId: quizzes[currentIndex].id,
      answerId: answer.id,
    };

    try {
      const res = await submitAnswer(payload);
      const correctAnswer = quizzes[currentIndex].answers.find(
        (a) => a.isCorrect === true
      );
      const correct = answer?.id === correctAnswer?.id;

      setIsCorrect(correct);
      setShowResult(true);
    } catch (error) {
      console.log("Submit failed:", error);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizzes.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswerId(null);
      setIsCorrect(null);
      setShowResult(false);
    } else {
      Alert.alert("Quiz Complete", "You've answered all the questions!", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1d4ed8" />
      </View>
    );
  }

  if (!quizzes.length || !quizzes[currentIndex]) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#999", fontStyle: "italic" }}>
          No quizzes available today.
        </Text>
      </View>
    );
  }

  const currentQuiz = quizzes[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🧠 Question {currentIndex + 1} of {quizzes.length}
      </Text>
      <Text style={styles.questionText}>{currentQuiz.questionText}</Text>

      {currentQuiz.answers.map((answer) => {
        const isSelected = selectedAnswerId === answer.id;
        const isAnswerCorrect = answer.isCorrect;

        const optionStyle = showResult
          ? isAnswerCorrect
            ? styles.correctOption
            : isSelected
            ? styles.wrongOption
            : styles.option
          : isSelected
          ? styles.selectedOption
          : styles.option;

        const textStyle =
          showResult && isAnswerCorrect
            ? styles.correctText
            : showResult && isSelected
            ? styles.wrongText
            : styles.optionText;

        return (
          <TouchableOpacity
            key={answer.id}
            style={optionStyle}
            onPress={() => handleSubmit(answer)}
            disabled={showResult}
          >
            <Text style={textStyle}>{answer.answerText}</Text>
          </TouchableOpacity>
        );
      })}

      {showResult && (
        <Text style={isCorrect ? styles.feedbackRight : styles.feedbackWrong}>
          {isCorrect ? "✅ Correct!" : "❌ Oops! That's incorrect."}
        </Text>
      )}

      {showResult && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex + 1 < quizzes.length
              ? "Next Question"
              : "Finish Quiz"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
    justifyContent: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1d4ed8",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
  },
  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "#dbeafe",
    borderColor: "#60a5fa",
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  correctOption: {
    backgroundColor: "#dcfce7",
    borderColor: "#22c55e",
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  wrongOption: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  optionText: {
    color: "#1f2937",
  },
  correctText: {
    color: "#15803d",
    fontWeight: "bold",
  },
  wrongText: {
    color: "#b91c1c",
    fontWeight: "bold",
  },
  feedbackRight: {
    color: "#16a34a",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 12,
  },
  feedbackWrong: {
    color: "#dc2626",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 12,
  },
  nextButton: {
    backgroundColor: "#1d4ed8",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
