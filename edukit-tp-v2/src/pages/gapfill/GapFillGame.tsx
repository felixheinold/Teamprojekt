import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./GapFillGame.css";

type Question = {
  sentence: string;
  answer: string;
};

const exampleQuestions: Question[] = [
  {
    sentence: "Die Photosynthese findet in den ___ statt.",
    answer: "Chloroplasten",
  },
  {
    sentence:
      "Der pH-Wert einer Lösung wird durch die Konzentration von ___ bestimmt.",
    answer: "Wasserstoffionen",
  },
  {
    sentence: "In der Informatik steht HTML für ___ Markup Language.",
    answer: "Hypertext",
  },
  {
    sentence: "Das Ohmsche Gesetz lautet U = R * ___.",
    answer: "I",
  },
];

const GapFillGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const {
    module = "",
    chapter = "",
    subject = "",
    questionCount = 3,
    timeLimit = 30,
  } = location.state || {};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(
    null
  );
  const [timer, setTimer] = useState(timeLimit);

  // 🔊 Sound-Refs
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSound.current = new Audio("/sounds/correct.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");
  }, []);

  useEffect(() => {
    const repeated: Question[] = [];
    while (repeated.length < questionCount) {
      const shuffled = [...exampleQuestions].sort(() => Math.random() - 0.5);
      repeated.push(...shuffled);
    }
    setQuestions(repeated.slice(0, questionCount));
  }, [questionCount]);

  useEffect(() => {
    if (currentIndex >= questions.length || showFeedback !== null) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          checkOnTimeout();
          return timeLimit;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, timeLimit, questions.length, showFeedback]);

  const checkOnTimeout = () => {
    const correct = questions[currentIndex].answer.trim().toLowerCase();
    const user = input.trim().toLowerCase();
    const isCorrect = user === correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowFeedback("correct");
      setTimeout(() => {
        setShowFeedback(null);
        handleNext();
      }, 1500);
    } else {
      setShowFeedback("wrong");
      setTimeout(() => {
        setShowFeedback(null);
        handleNext();
      }, 3000);
    }
  };

  const handleCheck = () => {
    if (!input.trim()) return;

    const correct = questions[currentIndex].answer.trim().toLowerCase();
    const user = input.trim().toLowerCase();
    const isCorrect = user === correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowFeedback("correct");
      correctSound.current?.play();
    } else {
      setShowFeedback("wrong");
      wrongSound.current?.play();
    }

    setTimeout(() => {
      setShowFeedback(null);
      handleNext();
    }, isCorrect ? 1500 : 3000);
  };

  const handleNext = () => {
    setInput("");
    setTimer(timeLimit);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
      handleCheck();
    }
  };

  const current = questions[currentIndex];

  if (currentIndex >= questions.length) {
    navigate("/gapfillresult", {
      state: { module, chapter, subject, questionCount, timeLimit, score },
    });
    return null;
  }

  const isCorrect = showFeedback === "correct";
  const isWrong = showFeedback === "wrong";

  return (
    <div className="gapfill-wrapper">
      {/* Abbrechen-Button */}
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

      {/* Modul */}
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

      {/* Kapitel */}
      <div
        className="mb-4 px-4 py-2 rounded text-dark fw-semibold text-center"
        style={{ backgroundColor: "#78ba84", maxWidth: "600px", width: "100%" }}
      >
        {chapter}
      </div>

      <div className="quiz-status">
        <div>
          Frage {currentIndex + 1} / {questions.length}
        </div>
        <div>⏳ {timer}s</div>
      </div>

      <div className="gapfill-question">
        {current.sentence.replace("___", "______")}
      </div>

      <input
        type="text"
        className={`form-control text-center fw-semibold mb-3 gapfill-input ${
          isCorrect ? "correct" : isWrong ? "wrong" : ""
        }`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Begriff eingeben..."
        disabled={showFeedback !== null}
      />
      {isCorrect && (
        <div className="text-success fw-bold mb-2">✅ Richtig!</div>
      )}
      {isWrong && (
        <div className="text-danger fw-bold mb-2">
          ❌ Falsch! Richtige Antwort: <u>{current.answer}</u>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="gapfill-check"
        onClick={handleCheck}
        disabled={!input || showFeedback !== null}
      >
        ✅ Antwort überprüfen
      </motion.button>
    </div>
  );
};

export default GapFillGame;
