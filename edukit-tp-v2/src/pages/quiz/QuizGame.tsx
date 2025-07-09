import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./QuizGame.css";

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

  const {
    module,
    chapter,
    questionCount = 2,
    timeLimit = 20,
    questions: incomingQuestions,
  } = location.state || {};

  const questions = incomingQuestions?.length ? incomingQuestions : sampleQuestions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isPostponed, setIsPostponed] = useState(false);

  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex + 1 === questionCount;
  const postponedKey = `postponed_${module}_${chapter}`;

  useEffect(() => {
    correctSound.current = new Audio("/sounds/correct.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");
  }, []);

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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(postponedKey) || "[]");
    const alreadySaved = stored.some(q => q.question === currentQuestion.question);
    setIsPostponed(alreadySaved);
  }, [currentIndex, currentQuestion, postponedKey]);

  const handleAnswer = (selected: string | null) => {
    if (showFeedback) return;
    setSelectedAnswer(selected);
    setShowFeedback(true);

    const correct = selected && selected === currentQuestion.answer;
    if (correct) {
      setScore((prev) => prev + 1);
      correctSound.current?.play();
    } else {
      wrongSound.current?.play();
    }
  };

  const handleNext = () => {
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

  const togglePostpone = () => {
    const stored = JSON.parse(localStorage.getItem(postponedKey) || "[]");
    const alreadySaved = stored.some(q => q.question === currentQuestion.question);
    const updated = alreadySaved
      ? stored.filter(q => q.question !== currentQuestion.question)
      : [...stored, currentQuestion];
    localStorage.setItem(postponedKey, JSON.stringify(updated));
    setIsPostponed(!alreadySaved);
  };

  const isCorrect = (opt: string) => opt === currentQuestion.answer;
  const isWrong = (opt: string) => opt === selectedAnswer && !isCorrect(opt);

  return (
    <div className="quizgame-wrapper">
      {/* Abbrechen & Zurückstellen */}
      <div className="top-button-row">
        <div className="cancel-button">
          {!showCancelConfirm ? (
            <button className="btn btn-dark" onClick={() => setShowCancelConfirm(true)}>
              Abbrechen
            </button>
          ) : (
            <div className="cancel-confirm-container">
              <div className="cancel-confirm-text">Möchtest du wirklich abbrechen?</div>
              <div className="cancel-confirm-buttons">
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

        {!showCancelConfirm && (
          <div className="postpone-button">
            <button
              className={`btn btn-dark ${isPostponed ? "active" : ""}`}
              onClick={togglePostpone}
            >
              {isPostponed ? "Zurückstellung aufheben" : "Frage zurückstellen"}
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="quiz-header bg-module">{module}</div>
      <div className="quiz-subheader bg-chapter">{chapter}</div>

      {/* Status */}
      <div className="quiz-status">
        <span>Frage {currentIndex + 1} / {questionCount}</span>
        <span>⏳ {timeLeft}s</span>
      </div>

      {/* Frage */}
      <div className="quiz-question">{currentQuestion.question}</div>

      {/* Antwortoptionen */}
      <div className="quiz-options">
        {currentQuestion.options.map((opt, i) => {
          let bg = "#e0e0e0";
          if (showFeedback) {
            if (isCorrect(opt)) bg = "#198754"; // grün
            else if (isWrong(opt)) bg = "#dc3545"; // rot
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

      {/* Weiter-Button */}
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
