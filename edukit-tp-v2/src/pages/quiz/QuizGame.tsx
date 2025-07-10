import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./QuizGame.css";

const QuizGame = () => {
  type QuizQuestion = {
    id: string;
    question: string;
    options: string[];
    answer: string;
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
const volume = Number(localStorage.getItem("volume") || "50") / 100;

  const {
    module,
    chapter,
    questionCount = 2,
    timeLimit = 20,
    questions: incomingQuestions,
  } = location.state || {};

  const sampleQuestions: QuizQuestion[] = [
    {
      id: "pb-k1-de-qz1",
      question: "Was ist die Hauptstadt von Frankreich?",
      options: ["Paris", "Berlin", "Madrid", "Rom"],
      answer: "Paris",
    },
    {
      id: "pb-k1-de-qz2",
      question: "Was ist 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4",
    },
    {
      id: "pb-k1-de-qz3",
      question: "Welcher Planet ist der größte im Sonnensystem?",
      options: ["Mars", "Jupiter", "Saturn", "Erde"],
      answer: "Jupiter",
    },
    {
      id: "pb-k1-de-qz4",
      question: "Welches Element hat das chemische Symbol 'Fe'?",
      options: ["Fluor", "Eisen", "Zinn", "Blei"],
      answer: "Eisen",
    },
    {
      id: "pb-k1-de-qz5",
      question: "Wie viele Bundesländer hat Deutschland?",
      options: ["14", "15", "16", "17"],
      answer: "16",
    },
    {
      id: "pb-k1-de-qz6",
      question: "Wie viele Minuten hat eine Stunde?",
      options: ["30", "45", "60", "90"],
      answer: "60",
    },
    {
      id: "pb-k1-de-qz7",
      question:
        "Welche Programmiersprache wird im Web am häufigsten verwendet?",
      options: ["Python", "JavaScript", "C#", "Java"],
      answer: "JavaScript",
    },
    {
      id: "pb-k1-de-qz8",
      question: "Wie heißt der höchste Berg der Erde?",
      options: ["Mount Everest", "K2", "Kilimandscharo", "Mont Blanc"],
      answer: "Mount Everest",
    },
    {
      id: "pb-k1-de-qz9",
      question: "Welche Farbe ergibt sich aus Blau und Gelb?",
      options: ["Orange", "Grün", "Violett", "Braun"],
      answer: "Grün",
    },
    {
      id: "pb-k1-de-qz10",
      question: "Wie viele Kontinente gibt es?",
      options: ["5", "6", "7", "8"],
      answer: "7",
    },
    {
      id: "pb-k1-de-qz11",
      question: "Was ist das Ergebnis von 5 × 6?",
      options: ["30", "11", "56", "25"],
      answer: "30",
    },
    {
      id: "pb-k1-de-qz12",
      question: "Wie nennt man ein Vieleck mit acht Ecken?",
      options: ["Hexagon", "Heptagon", "Oktagon", "Dezagon"],
      answer: "Oktagon",
    },
  ];

  const shuffle = <T,>(array: T[]): T[] =>
    [...array].sort(() => Math.random() - 0.5);

  const allChapterQuestions: QuizQuestion[] = incomingQuestions?.length
    ? (incomingQuestions as QuizQuestion[])
    : sampleQuestions;

  const [questions] = useState<QuizQuestion[]>(() => {
    const baseQuestions: QuizQuestion[] = incomingQuestions?.length
      ? (incomingQuestions as QuizQuestion[])
      : sampleQuestions;
    return shuffle(baseQuestions).slice(0, questionCount);
  });

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

  if (correctSound.current) correctSound.current.volume = volume;
  if (wrongSound.current) wrongSound.current.volume = volume;
}, [volume]);

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
    const alreadySaved = stored.some(
      (q) => q.question === currentQuestion.question
    );
    setIsPostponed(alreadySaved);
  }, [currentIndex, currentQuestion, postponedKey]);

  const handleAnswer = (selected: string | null) => {
    if (showFeedback) return;
    setSelectedAnswer(selected);
    setShowFeedback(true);

    const correct = selected && selected === currentQuestion.answer;
    if (correct) {
      setScore((prev) => prev + 1);
      if (soundEnabled) correctSound.current?.play();
    } else {
      if (soundEnabled) wrongSound.current?.play();

      const statsKey = "userStats";
      const gameKey = "quiz";
      const stored = localStorage.getItem(statsKey);
      const allStats = stored ? JSON.parse(stored) : {};

      if (!allStats[gameKey]) allStats[gameKey] = {};
      if (!allStats[gameKey][module]) allStats[gameKey][module] = {};
      if (!allStats[gameKey][module][chapter])
        allStats[gameKey][module][chapter] = { correct: [] };

      const correctList = allStats[gameKey][module][chapter].correct;

      if (!correctList.includes(currentQuestion.id)) {
        correctList.push(currentQuestion.id);
        localStorage.setItem(statsKey, JSON.stringify(allStats));
      }
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      navigate("/quizresult", {
        state: {
          module,
          chapter,
          questionCount,
          timeLimit,
          score,
          questions,
          correctIds: questions
            .slice(0, currentIndex + 1)
            .filter((q, i) => q.answer === questions[i].answer && i < score)
            .map((q) => q.id),
          allIds: allChapterQuestions.map((q) => q.id),
        },
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
    const alreadySaved = stored.some(
      (q) => q.question === currentQuestion.question
    );
    const updated = alreadySaved
      ? stored.filter((q) => q.question !== currentQuestion.question)
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
            <button
              className="btn btn-dark"
              onClick={() => setShowCancelConfirm(true)}
            >
              Abbrechen
            </button>
          ) : (
            <div className="cancel-confirm-container">
              <div className="cancel-confirm-text">
                Möchtest du wirklich abbrechen?
              </div>
              <div className="cancel-confirm-buttons">
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
        <span>
          Frage {currentIndex + 1} / {questionCount}
        </span>
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
