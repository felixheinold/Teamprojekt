import { useEffect, useState } from "react";
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
    sentence: "Das Ohmsche Gesetz lautet U = R * ___ .",
    answer: "I",
  },
];

const GapFillGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isPostponed, setIsPostponed] = useState(false);

  const {
    module = "",
    chapter = "",
    subject = "",
    questionCount = 3,
    timeLimit = 30,
    questions: incomingQuestions,
  } = location.state || {};

  const postponedKey = `postponed_gapfill_${module}_${chapter}`;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(
    null
  );
  const [timer, setTimer] = useState(timeLimit);
  const [timerExpired, setTimerExpired] = useState(false);

  // 1. Initiale Fragen laden
  useEffect(() => {
    if (incomingQuestions?.length) {
      setQuestions(incomingQuestions);
    } else {
      const repeated: Question[] = [];
      while (repeated.length < questionCount) {
        const shuffled = [...exampleQuestions].sort(() => Math.random() - 0.5);
        repeated.push(...shuffled);
      }
      setQuestions(repeated.slice(0, questionCount));
    }
  }, [questionCount, incomingQuestions]);

  // 2. Timer pro Frage starten
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

  // 3. Postpone-Status laden
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(postponedKey) || "[]");
    const alreadySaved = stored.some(
      (q: Question) => q.sentence === questions[currentIndex]?.sentence
    );
    setIsPostponed(alreadySaved);
  }, [currentIndex, questions]);

  const togglePostpone = () => {
    const stored = JSON.parse(localStorage.getItem(postponedKey) || "[]");
    const alreadySaved = stored.some(
      (q: Question) => q.sentence === questions[currentIndex].sentence
    );

    let updated;

    if (alreadySaved) {
      updated = stored.filter(
        (q: Question) => q.sentence !== questions[currentIndex].sentence
      );
    } else {
      updated = [...stored, questions[currentIndex]];
    }

    localStorage.setItem(postponedKey, JSON.stringify(updated));
    setIsPostponed(!alreadySaved);
  };

  const checkOnTimeout = () => {
    checkAnswer(input);
  };

  const handleCheck = () => {
    if (!input.trim()) return;
    checkAnswer(input);
  };

  const checkAnswer = (userInput: string) => {
    const correct = questions[currentIndex].answer.trim().toLowerCase();
    const user = userInput.trim().toLowerCase();
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
      <div className="top-button-row">
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

      <div className="gapfill-header">{module}</div>
      <div className="gapfill-subheader">{chapter}</div>

      <div className="gapfill-status">
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
