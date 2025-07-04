import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Question = {
  sentence: string; // Satz mit ___ als Lücke
  answer: string; // Fachbegriff
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
  { sentence: "Das Ohmsche Gesetz lautet U = R * ___.", answer: "I" },
];

const GapFillGame = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const repeatedQuestions: Question[] = [];
    while (repeatedQuestions.length < questionCount) {
      const shuffled = [...exampleQuestions].sort(() => Math.random() - 0.5);
      repeatedQuestions.push(...shuffled);
    }
    setQuestions(repeatedQuestions.slice(0, questionCount));
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
    const correctAnswer = questions[currentIndex].answer.trim().toLowerCase();
    const userAnswer = input.trim().toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowFeedback("correct");
    } else {
      setShowFeedback("wrong");
    }

    setTimeout(
      () => {
        setShowFeedback(null);
        handleNext();
      },
      isCorrect ? 1500 : 3000
    );
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
      state: {
        module,
        chapter,
        subject,
        questionCount,
        timeLimit,
        score,
      },
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
      {/* Abbrechen-Button */}
      <button
        className="btn btn-dark position-absolute"
        style={{ top: "80px", left: "30px", zIndex: 10 }}
        onClick={() => navigate(-2)}
      >
        Abbrechen
      </button>

      {/* Modul-Anzeige */}
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

      {/* Kapitel-Anzeige */}
      <div
        className="mb-4 px-4 py-2 rounded text-dark fw-semibold text-center"
        style={{ backgroundColor: "#78ba84", maxWidth: "600px", width: "100%" }}
      >
        {chapter}
      </div>

      {/* Fragezähler + Timer */}
      <div
        className="d-flex justify-content-between mb-3 mt-4"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <div className="fw-semibold">
          Frage {currentIndex + 1} / {questions.length}
        </div>
        <div className="fw-semibold">⏳ {timer}s</div>
      </div>

      {/* Fragebox */}
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
      {showFeedback === "correct" && (
        <div className="text-success fw-bold mb-2">✅ Richtig!</div>
      )}
      {showFeedback === "wrong" && (
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
