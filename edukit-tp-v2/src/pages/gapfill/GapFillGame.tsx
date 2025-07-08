import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
    if (currentIndex >= questions.length) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleNext();
          return timeLimit;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, timeLimit, questions.length]);

  const handleCheck = () => {
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

      {/* Fragezähler & Timer */}
      <div
        className="d-flex justify-content-between mb-3 mt-4"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <div className="fw-semibold">
          Frage {currentIndex + 1} / {questions.length}
        </div>
        <div className="fw-semibold">⏳ {timer}s</div>
      </div>

      {/* Frage */}
      <div
        className="mb-4 text-center fw-bold d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "#a4c4f4",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "600px",
          minHeight: "100px",
          fontSize: "1.25rem",
          padding: "1rem",
        }}
      >
        {current.sentence.replace("___", "______")}
      </div>

      {/* Eingabe */}
      <input
        type="text"
        className="form-control text-center fw-semibold mb-3"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          maxWidth: "600px",
          fontSize: "1.2rem",
          border: `3px solid ${
            isCorrect ? "#198754" : isWrong ? "#dc3545" : "#ced4da"
          }`,
          backgroundColor: isCorrect
            ? "#198754"
            : isWrong
            ? "#dc3545"
            : "white",
        }}
        placeholder="Begriff eingeben..."
        disabled={showFeedback !== null}
      />

      {/* Feedback */}
      {isCorrect && (
        <div className="text-success fw-bold mb-2">✅ Richtig!</div>
      )}
      {isWrong && (
        <div className="text-danger fw-bold mb-2">
          ❌ Falsch! Richtige Antwort: <u>{current.answer}</u>
        </div>
      )}

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn fw-bold text-white"
        style={{
          backgroundColor: "#5989d6",
          fontSize: "1.2rem",
          borderRadius: "12px",
          padding: "10px 24px",
          maxWidth: "600px",
          width: "100%",
        }}
        onClick={handleCheck}
        disabled={!input || showFeedback !== null}
      >
        ✅ Antwort überprüfen
      </motion.button>
    </div>
  );
};

export default GapFillGame;
