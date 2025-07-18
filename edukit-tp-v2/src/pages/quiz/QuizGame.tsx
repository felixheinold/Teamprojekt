import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useBackendUserContext } from "../../context/BackendUserContext";
import i18n from "i18next";
import "./QuizGame.css";

const QuizGame = () => {
  const { user, setUser, untrackedChanges, flushUser } =
    useBackendUserContext();
  const { t } = useTranslation();
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
    subject,
    chapter,
    questionCount = 2,
    timeLimit = 20,
    questions: incomingQuestions,
    isAllChapters = false,
    chapterCount = 1,
  } = location.state || {};

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [allChapterQuestions, setAllChapterQuestions] = useState<
    QuizQuestion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [correctIdsThisGame, setCorrectIdsThisGame] = useState<string[]>([]);

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

  const mapBackendToQuiz = (backendQuestion: any): QuizQuestion => {
    return {
      id: backendQuestion.id,
      question: backendQuestion.content,
      options: backendQuestion.answers.map((a: any) => a.text),
      answer:
        backendQuestion.answers.find((a: any) => a.is_correct)?.text || "",
    };
  };

  const loadQuizQuestions = async (): Promise<QuizQuestion[]> => {
    const subjectKey = subject?.toLowerCase();
    const langKey = i18n.language.startsWith("de") ? "de" : "en";

    if (!subjectKey) return sampleQuestions;

    if (isAllChapters) {
      const promises = Array.from({ length: chapterCount }, (_, i) => {
        const chapterKey = `k${i + 1}`;
        const path = `/questions/quizz/${subjectKey}/${subjectKey}_${chapterKey}_${langKey}.json`;
        return fetch(path)
          .then((res) => (res.ok ? res.json() : []))
          .catch(() => []);
      });
      const allResults = await Promise.all(promises);
      const combined = allResults.flat();
      return combined.length > 0
        ? combined.map(mapBackendToQuiz)
        : sampleQuestions;
    }

    const match = chapter?.match(/Kapitel (\d+)/i);
    const chapterKey = match ? `k${match[1]}` : null;
    if (!chapterKey) return sampleQuestions;

    const path = `/questions/quizz/${subjectKey}/${subjectKey}_${chapterKey}_${langKey}.json`;

    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error("Datei nicht gefunden");
      const data = await res.json();
      return data.map(mapBackendToQuiz);
    } catch {
      return sampleQuestions;
    }
  };

  useEffect(() => {
    if (!incomingQuestions?.length) {
      loadQuizQuestions().then((data) => {
        setAllChapterQuestions(data);
        setQuestions(shuffle(data).slice(0, questionCount));
        setLoading(false);
      });
    } else {
      setAllChapterQuestions(incomingQuestions);
      setQuestions(
        shuffle(incomingQuestions as QuizQuestion[]).slice(0, questionCount)
      );
      setLoading(false);
    }
  }, [module, chapter, questionCount]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isPostponed, setIsPostponed] = useState(false);

  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex + 1 === questions.length;
  const postponedKey = `postponed_${module}_${chapter}`;

  useEffect(() => {
    correctSound.current = new Audio("/sounds/correct.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");
    if (correctSound.current) correctSound.current.volume = volume;
    if (wrongSound.current) wrongSound.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (loading || !currentQuestion || showFeedback) return;

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
  }, [loading, currentQuestion, showFeedback]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(postponedKey) || "[]");
    const alreadySaved = stored.some(
      (q: QuizQuestion) => q.question === currentQuestion?.question
    );
    setIsPostponed(alreadySaved);
  }, [currentIndex, currentQuestion, postponedKey]);

  const handleAnswer = (selected: string | null) => {
    if (showFeedback) return;

    const correct = selected === currentQuestion.answer;

    setSelectedAnswer(selected ?? "__TIMEOUT__");
    setShowFeedback(true);

    if (correct) {
      setScore((prev) => prev + 1);
      if (soundEnabled) correctSound.current?.play();

      if (!correctIdsThisGame.includes(currentQuestion.id)) {
        setCorrectIdsThisGame((prev) => [...prev, currentQuestion.id]);
      }
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

  const handleNext = async () => {
    if (showFeedback === false) return; // Schütze vor Doppelklicks

    if (isLastQuestion && user) {
      const correctIds = questions
        .slice(0, currentIndex + 1)
        .filter(
          (q, i) => q.answer === q.options.find((opt) => opt === selectedAnswer)
        )
        .map((q) => q.id);

      try {
        const current = user.user_game_information.quiz;

        const updatedUser = {
          ...user,
          user_game_information: {
            ...user.user_game_information,
            quiz: {
              ...current,
              total_games: current.total_games + 1,
              total_points: current.total_points + score,
              max_points: current.max_points + questionCount,
              best_Score: Math.max(current.best_Score, score),
              accuracy:
                (current.total_points + score) /
                (current.max_points + questionCount),
              last_played: new Date().toISOString(),
            },
          },
        };

        setUser(updatedUser); // ⬅️ sehr wichtig!
        console.log("📊 Neuer Stand:", updatedUser.user_game_information.quiz);
        untrackedChanges(); // markiert den Context als „dirty“
        await flushUser(); // schreibt den aktuellen Context ins Backend
        console.log(user.user_game_information);
        await flushUser(updatedUser)
          .then(() => console.log("✅ flushUser erfolgreich"))
          .catch(async (err) => {
            console.error("❌ flushUser failed", err);
            const res = await fetch(
              "https://api.edukit-tp.me/users/update-whole-user/" +
                user.user_id,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
              }
            );
            const text = await res.text();
            console.warn("🔍 Backend Antwort:", text);
          });
      } catch (err) {
        console.error("❌ Fehler beim Aktualisieren des Fortschritts:", err);
      }

      navigate("/quizresult", {
        state: {
          module,
          chapter,
          subject,
          questionCount,
          timeLimit,
          score,
          questions,
          correctIds: correctIdsThisGame,
          allIds: allChapterQuestions.map((q) => q.id),
          isAllChapters,
          chapterCount,
          finished: true,
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
      (q: QuizQuestion) => q.question === currentQuestion.question
    );
    const updated = alreadySaved
      ? stored.filter(
          (q: QuizQuestion) => q.question !== currentQuestion.question
        )
      : [...stored, currentQuestion];
    localStorage.setItem(postponedKey, JSON.stringify(updated));
    setIsPostponed(!alreadySaved);
  };

  const isCorrect = (opt: string) => opt === currentQuestion.answer;
  const isWrong = (opt: string) =>
    selectedAnswer !== null && opt === selectedAnswer && !isCorrect(opt);

  if (loading || !currentQuestion) {
    return (
      <div className="quizgame-wrapper">
        <div className="quiz-status">{t("quizgame.loading")}</div>
      </div>
    );
  }

  return (
    <div className="quizgame-wrapper">
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

      <div className="quiz-header bg-module">{t(`modules.${module}`)}</div>
      <div className="quiz-subheader bg-chapter">{chapter}</div>

      <div className="quiz-status">
        <span>
          <span>
            {t("quizgame.questionCount")} {currentIndex + 1} /{" "}
            {questions.length}
          </span>
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
        {isLastQuestion ? t("quizgame.finish") : t("quizgame.next")}
      </motion.button>
    </div>
  );
};

export default QuizGame;
