import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./GapFillGame.css";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

type Question = {
  id: string;
  sentence: string;
  answer: string;
};

const exampleQuestions: Question[] = [
  {
    id: "gf-k1-de-q1",
    sentence: "Die Photosynthese findet in den ___ statt.",
    answer: "Chloroplasten",
  },
  {
    id: "gf-k1-de-q2",
    sentence:
      "Der pH-Wert einer Lösung wird durch die Konzentration von ___ bestimmt.",
    answer: "Wasserstoffionen",
  },
  {
    id: "gf-k1-de-q3",
    sentence: "In der Informatik steht HTML für ___ Markup Language.",
    answer: "Hypertext",
  },
  {
    id: "gf-k1-de-q4",
    sentence: "Das Ohmsche Gesetz lautet U = R * ___.",
    answer: "I",
  },
  {
    id: "gf-k1-de-q5",
    sentence: "Die Erde dreht sich in 24 Stunden um ihre eigene ___.",
    answer: "Achse",
  },
  {
    id: "gf-k1-de-q6",
    sentence: "Die Hauptstadt von Italien ist ___.",
    answer: "Rom",
  },
  {
    id: "gf-k1-de-q7",
    sentence: "Ein Dreieck hat insgesamt ___ Innenwinkel.",
    answer: "drei",
  },
  { id: "gf-k1-de-q8", sentence: "Ein Jahr hat ___ Monate.", answer: "12" },
  {
    id: "gf-k1-de-q9",
    sentence: "Die größte Wüste der Erde ist die ___ Wüste.",
    answer: "Antarktische",
  },
  {
    id: "gf-k1-de-q10",
    sentence: "Ein Viereck mit vier rechten Winkeln ist ein ___.",
    answer: "Rechteck",
  },
  {
    id: "gf-k1-de-q11",
    sentence: "Wasser hat die chemische Formel ___.",
    answer: "H2O",
  },
  {
    id: "gf-k1-de-q12",
    sentence: "Die Hauptstadt von Frankreich ist ___.",
    answer: "Paris",
  },
  {
    id: "gf-k1-de-q13",
    sentence: "Die kleinste Primzahl ist ___.",
    answer: "2",
  },
];

const shuffle = <T,>(array: T[]): T[] =>
  [...array].sort(() => Math.random() - 0.5);

const GapFillGame = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutHandledRef = useRef(false);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isPostponed, setIsPostponed] = useState(false);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allChapterQuestions, setAllChapterQuestions] = useState<Question[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
  const volume = Number(localStorage.getItem("volume") || "50") / 100;

  const {
    module = "",
    chapter = "",
    subject = "",
    questionCount = 3,
    timeLimit = 30,
    questions: incomingQuestions,
  } = location.state || {};

  const postponedKey = `postponed_gapfill_${module}_${chapter}`;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(
    null
  );
  const [timer, setTimer] = useState(timeLimit);

  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSound.current = new Audio("/sounds/correct.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");

    if (correctSound.current) correctSound.current.volume = volume;
    if (wrongSound.current) wrongSound.current.volume = volume;
  }, [volume]);

  const loadGapfillQuestions = async (): Promise<Question[]> => {
    const subjectKey = subject?.toLowerCase();
    const match = chapter?.match(/Kapitel (\d+)/i);
    const chapterKey = match ? `k${match[1]}` : null;
    const langKey = i18n.language.startsWith("de") ? "de" : "en";

    if (!subjectKey || !chapterKey) return exampleQuestions;

    const path = `/questions/gapfill/${subjectKey}_${chapterKey}_${langKey}.json`;

    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error("Datei nicht gefunden");
      return await res.json();
    } catch {
      return exampleQuestions;
    }
  };

  useEffect(() => {
    if (!incomingQuestions?.length) {
      loadGapfillQuestions().then((data) => {
        setAllChapterQuestions(data);
        setQuestions(shuffle(data).slice(0, questionCount));
        setLoading(false);
      });
    } else {
      setAllChapterQuestions(incomingQuestions);
      setQuestions(
        shuffle(incomingQuestions as Question[]).slice(0, questionCount)
      );
      setLoading(false);
    }
  }, [module, chapter, questionCount]);

  useEffect(() => {
    if (currentIndex >= questions.length || showFeedback !== null || loading)
      return;

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
  }, [currentIndex, timeLimit, showFeedback, loading]);

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

    const updated = alreadySaved
      ? stored.filter(
          (q: Question) => q.sentence !== questions[currentIndex].sentence
        )
      : [...stored, questions[currentIndex]];

    localStorage.setItem(postponedKey, JSON.stringify(updated));
    setIsPostponed(!alreadySaved);
  };

  const checkOnTimeout = () => {
    if (timeoutHandledRef.current) return;
    timeoutHandledRef.current = true;
    const correct = questions[currentIndex].answer.trim().toLowerCase();
    const user = input.trim().toLowerCase();
    const isCorrect = user === correct;

    if (isCorrect) {
      if (soundEnabled) correctSound.current?.play();
      setScore((prev) => prev + 1);
      setCorrectIds((prev) => [...prev, questions[currentIndex].id]);
      setShowFeedback("correct");
    } else {
      if (soundEnabled) wrongSound.current?.play();
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

  const handleCheck = () => {
    if (!input.trim()) return;
    checkAnswer(input);
  };

  const checkAnswer = (userInput: string) => {
    const correct = questions[currentIndex].answer.trim().toLowerCase();
    const user = userInput.trim().toLowerCase();
    const isCorrect = user === correct;

    if (isCorrect) {
      if (soundEnabled) correctSound.current?.play();
      setScore((prev) => prev + 1);
      setCorrectIds((prev) => [...prev, questions[currentIndex].id]);
      setShowFeedback("correct");
    } else {
      if (soundEnabled) wrongSound.current?.play();
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
    timeoutHandledRef.current = false;
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
  const allIds = allChapterQuestions.map((q) => q.id);
  const isCorrect = showFeedback === "correct";
  const isWrong = showFeedback === "wrong";

  useEffect(() => {
    if (currentIndex >= questions.length && !loading) {
      navigate("/gapfillresult", {
        state: {
          module,
          chapter,
          subject,
          questionCount,
          timeLimit,
          score,
          correctIds,
          questions,
          allIds,
        },
      });
    }
  }, [currentIndex, questions.length, loading]);

  if (loading || !current) {
    return (
      <div className="gapfill-wrapper">
        <div className="gapfill-status">{t("gapfillgame.loading")}</div>
      </div>
    );
  }

  return (
    <div className="gapfill-wrapper">
      <div className="top-button-row">
        <div className="cancel-button">
          {!showCancelConfirm ? (
            <button
              className="btn btn-dark"
              onClick={() => setShowCancelConfirm(true)}
            >
              {t("common.cancel")}
            </button>
          ) : (
            <div className="cancel-confirm-container">
              <div className="cancel-confirm-text">
                {t("common.confirmCancel")}
              </div>
              <div className="cancel-confirm-buttons">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  {t("common.no")}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => navigate(-2)}
                >
                  {t("common.yesBack")}
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
              {isPostponed ? t("common.postponeRemove") : t("common.postpone")}
            </button>
          </div>
        )}
      </div>

      <div className="gapfill-header">{t(`modules.${module}`)}</div>
      <div className="gapfill-subheader">{chapter}</div>

      <div className="gapfill-status">
        <div>
          {t("gapfillgame.questionCount")} {currentIndex + 1} /{" "}
          {questions.length}
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
        placeholder={t("gapfillgame.placeholder")}
        disabled={showFeedback !== null}
      />

      {isCorrect && (
        <div className="text-success fw-bold mb-2">
          {t("gapfillgame.correct")}
        </div>
      )}
      {isWrong && (
        <div className="text-danger fw-bold mb-2">
          {t("gapfillgame.wrong")} <u>{current.answer}</u>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="gapfill-check"
        onClick={handleCheck}
        disabled={!input || showFeedback !== null}
      >
        {t("gapfillgame.check")}
      </motion.button>
    </div>
  );
};

export default GapFillGame;
