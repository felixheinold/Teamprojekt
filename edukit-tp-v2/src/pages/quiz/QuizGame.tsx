import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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

  const { module, chapter, questionCount = 2, timeLimit = 20 } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSound.current = new Audio("/sounds/correct.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");
  }, []);

  const currentQuestion = sampleQuestions[currentIndex % sampleQuestions.length];

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

  const handleAnswer = (selected) => {
    if (showFeedback) return;
    setSelectedAnswer(selected);
    setShowFeedback(true);

    const isCorrect = selected && selected === currentQuestion.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      correctSound.current?.play();
    } else {
      wrongSound.current?.play();
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

  const isCorrect = (opt) => opt === currentQuestion.answer;
  const isWrong = (opt) => opt === selectedAnswer && !isCorrect(opt);
  const isLastQuestion = currentIndex + 1 === questionCount;

  return (
    <div
      className="container d-flex flex-column align-items-center pt-2"
      style={{ minHeight: "100vh" }}
    >
      {/* Abbrechen */}
      <div
        className="position-absolute"
        style={{ top: "80px", left: "30px", zIndex: 10 }}
      >
        {!showCancelConfirm ? (
          <button className="btn btn-dark" onClick={() => setShowCancelConfirm(true)}>
            Abbrechen
          </button>
        ) : (
          <div className="cancel-confirm-container">
            <div className="cancel-confirm-text">
              Möchtest du wirklich abbrechen?
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowCancelConfirm(false)}>
                Nein
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => navigate(-2)}>
                Ja, zurück
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="mb-2 px-4 py-2 rounded-pill text-white fw-bold text-center"
        style={{
          backgroundColor: "#228b57",
          maxWidth: "600px",
          width: "100%",
          marginTop: "-8px",
        }}
      >
        {module}
      </div>

      <div className="mb-5 px-4 py-2 rounded text-dark fw-semibold text-center"
        style={{ backgroundColor: "#78ba84", maxWidth: "600px", width: "100%" }}
      >
        {chapter}
      </div>

      {/* Fortschritt & Timer */}
      <div className="d-flex justify-content-between mb-3" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="fw-semibold">
          Frage {currentIndex + 1} / {questionCount}
        </span>
        <span>⏳ {timeLeft}s</span>
      </div>

      <div className="quiz-question">{currentQuestion.question}</div>

      <div className="quiz-options">
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
              className="quiz-option"
              style={{ backgroundColor: bg }}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="quiz-next-button"
        onClick={handleNext}
        disabled={!showFeedback}
      >
        {isLastQuestion ? "Minispiel beenden" : "Nächste Frage"}
      </motion.button>
    </div>
  );
};

export default QuizGame;
