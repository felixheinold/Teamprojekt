import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const sampleQuestions = [
  {
    question: "Was ist die Hauptstadt von Frankreich?",
    options: ["Paris", "Berlin", "Madrid", "Rom"],
    answer: "Paris",
  },
  {
    question: "Was ist 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
];

const QuizGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { module, chapter, questionCount, timeLimit } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit || 20);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion =
    sampleQuestions[currentIndex % sampleQuestions.length];

  useEffect(() => {
    if (showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, timeLimit, showFeedback]);

  const handleAnswer = (selected: string | null) => {
    if (showFeedback) return;
    setSelectedAnswer(selected);
    setShowFeedback(true);

    if (selected && selected === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const isLastQuestion = currentIndex + 1 === questionCount;

    if (isLastQuestion) {
      navigate("/quizresult", {
        state: { module, chapter, questionCount, timeLimit, score },
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(timeLimit);
    }
  };

  const isCorrect = (opt: string) => opt === currentQuestion.answer;
  const isWrong = (opt: string) => opt === selectedAnswer && !isCorrect(opt);
  const isLastQuestion = currentIndex + 1 === questionCount;

  return (
    <div
      className="container d-flex flex-column align-items-center pt-2"
      style={{ minHeight: "100vh" }}
    >
      {/* Abbrechen mit Bestätigung */}
      <div
        className="position-absolute"
        style={{ top: "80px", left: "30px", zIndex: 10 }}
      >
        {!showCancelConfirm ? (
          <button
            className="btn btn-dark"
            onClick={() => setShowCancelConfirm(true)}
          >
            Abbrechen
          </button>
        ) : (
          <div className="d-flex flex-column gap-2">
            <div className="text-white bg-dark rounded px-3 py-2">
              Möchtest du wirklich abbrechen?
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCancelConfirm(false)}
              >
                Nein
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => navigate(-2)}
              >
                Ja, zurück
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modul & Kapitel */}
      <div
        className="mb-2 px-4 py-2 rounded-pill text-white fw-bold text-center"
        style={{
          backgroundColor: "#228b57",
          maxWidth: "600px",
          width: "100%",
          marginTop: "-8px",
        }}
      >
        {module}
      </div>

      <div
        className="mb-5 px-4 py-2 rounded text-dark fw-semibold text-center"
        style={{ backgroundColor: "#78ba84", maxWidth: "600px", width: "100%" }}
      >
        {chapter}
      </div>

      {/* Fortschritt & Timer */}
      <div
        className="d-flex justify-content-between mb-3"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <div className="fw-semibold">
          Frage {currentIndex + 1} / {questionCount}
        </div>
        <div className="fw-semibold">⏳ {timeLeft}s</div>
      </div>

      {/* Frage */}
      <div
        className="mb-4 text-center fw-bold d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "#a7e6ff",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "600px",
          minHeight: "100px",
          fontSize: "1.25rem",
          padding: "1rem",
        }}
      >
        {currentQuestion.question}
      </div>

      {/* Optionen */}
      <div
        className="d-flex flex-wrap justify-content-between gap-3 mb-4"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        {currentQuestion.options.map((opt, i) => {
          let bg = "#e0e0e0";
          if (showFeedback) {
            if (isCorrect(opt)) bg = "#198754";
            else if (isWrong(opt)) bg = "#dc3545";
          }

          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={showFeedback}
              onClick={() => handleAnswer(opt)}
              className="fw-semibold"
              style={{
                flex: "0 0 48%",
                minHeight: "60px",
                fontSize: "1rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: bg,
                color: "#000",
              }}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Weiter-Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="fw-bold text-white py-2"
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#5ac0f0",
          border: "none",
          borderRadius: "12px",
          fontSize: "1.3rem",
        }}
        onClick={handleNext}
        disabled={!showFeedback}
      >
        {isLastQuestion ? "Minispiel beenden" : "Nächste Frage"}
      </motion.button>
    </div>
  );
};

export default QuizGame;
