import { useAppFlow } from "../../context/AppFlowContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Minigames.css";

const Minigames = () => {
  const { selectedModule, selectedChapter } = useAppFlow();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [postponedCount, setPostponedCount] = useState(0);

  const [isPostponedMode, setIsPostponedMode] = useState(false);
  const [postponedQuestions, setPostponedQuestions] = useState<any[]>([]);

  const [selectedGame, setSelectedGame] = useState<null | {
    name: string;
    route: string;
  }>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [totalCounts, setTotalCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem("progress") || "{}");
    const progressMap: Record<string, number> = {};
    const totalCounts: Record<string, number> = {};

    const categories = ["quiz", "gapfill", "memory"];

    categories.forEach((category) => {
      const correctData =
        category === "memory"
          ? progress?.memory?.[selectedModule] || {}
          : progress?.[`${category}Correct`]?.[selectedModule] || {};

      const totalData =
        category === "memory"
          ? progress?.memoryTotal?.[selectedModule] || {}
          : progress?.[`${category}Total`]?.[selectedModule] || {};

      Object.keys({ ...correctData, ...totalData }).forEach((chapterKey) => {
        const correct = Array.isArray(correctData[chapterKey])
          ? correctData[chapterKey].length
          : 0;
        const total = Array.isArray(totalData[chapterKey])
          ? totalData[chapterKey].length
          : 0;
        const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
        progressMap[`${category}_${chapterKey}`] = percent;
        totalCounts[`${category}_${chapterKey}`] = total;
      });
    });

    setProgressMap(progressMap);
    setTotalCounts(totalCounts);
  }, [selectedModule]);

  const fullInfo = selectedChapter?.trim() || "";
  const hasMultiSubjects =
    fullInfo.length > 0 && !fullInfo.includes(selectedModule);
  const secondLine = hasMultiSubjects
    ? fullInfo
    : fullInfo.replace(`${selectedModule} `, "");

  const games = [
    {
      id: "quiz",
      name: t("minigames.quiz"),
      color: "#a7e6ff",
      icon: "/images/quiz.png",
      route: "/quiz",
    },
    {
      id: "memory",
      name: t("minigames.memory"),
      color: "#d3bfff",
      icon: "/images/memory.png",
      route: "/memory",
    },
    {
      id: "gapfill",
      name: t("minigames.gapfill"),
      color: "#a4c4f4",
      icon: "/images/fillgap.png",
      route: "/gapfill",
    },
  ];

  const shuffleArray = (arr: any[]) => {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleGameClick = (game: { name: string; route: string }) => {
    let key = "";

    if (game.route === "/quiz") {
      key = `postponed_${selectedModule}_${fullInfo}`;
    } else if (game.route === "/gapfill") {
      key = `postponed_gapfill_${selectedModule}_${fullInfo}`;
    }

    if (key) {
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      const count = stored.length;

      if (count > 0) {
        setSelectedGame(game);
        setPostponedCount(count);
        setShowChoiceModal(true);
        return;
      }
    }

    setSelectedGame(game);
    setShowModal(true);
  };

  const handleStart = () => {
    if (!selectedGame) return;

    if (isPostponedMode && postponedQuestions.length > 0) {
      navigate(selectedGame.route, {
        state: {
          module: selectedModule,
          chapter: selectedChapter,
          questions: postponedQuestions.slice(0, questionCount),
          questionCount,
          timeLimit,
          fromPostponed: true,
        },
      });
    } else {
      navigate(selectedGame.route, {
        state: {
          module: selectedModule,
          subject: hasMultiSubjects
            ? fullInfo.split(" Kapitel")[0]
            : selectedModule,
          chapter: fullInfo,
          questionCount,
          timeLimit,
        },
      });
    }
  };

  const handlePostponedStart = () => {
    const key = `postponed_${selectedModule}_${selectedChapter}`;
    const questions = JSON.parse(localStorage.getItem(key) || "[]");
    if (!questions.length) return;

    setSelectedGame({ name: "Quiz", route: "/quiz" });
    setPostponedQuestions(shuffleArray(questions));
    setIsPostponedMode(true);
    setShowChoiceModal(false);
    setShowModal(true);
  };

  const handleGapFillPostponedStart = () => {
    const key = `postponed_gapfill_${selectedModule}_${selectedChapter}`;
    const questions = JSON.parse(localStorage.getItem(key) || "[]");
    if (!questions.length) return;

    setSelectedGame({ name: "GapFill", route: "/gapfill" });
    setPostponedQuestions(shuffleArray(questions));
    setIsPostponedMode(true);
    setShowChoiceModal(false);
    setShowModal(true);
  };

  const isMemory = selectedGame?.route === "/memory";
  const category = isMemory
    ? "memory"
    : selectedGame?.route === "/gapfill"
    ? "gapfill"
    : "quiz";
  const totalAvailable = totalCounts[`${category}_${selectedChapter}`] || 0;

  const questionOptions = (() => {
    if (isPostponedMode && postponedQuestions.length > 0) {
      return Array.from({ length: postponedQuestions.length }, (_, i) => i + 1);
    }

    if (totalAvailable === 0) {
      // Fallback: Standardauswahl bei unbekannter Totalanzahl
      return isMemory
        ? Array.from({ length: 11 }, (_, i) => i + 5) // 5–15
        : Array.from({ length: 10 }, (_, i) => (i + 1) * 2); // 2–20
    }

    return isMemory
      ? Array.from(
          { length: Math.max(0, Math.min(15, totalAvailable) - 4) },
          (_, i) => i + 5
        )
      : Array.from(
          { length: Math.floor(Math.min(30, totalAvailable) / 2) },
          (_, i) => (i + 1) * 2
        );
  })();

  return (
    <div className="minigames-wrapper container py-4 d-flex flex-column align-items-center">
      <div className="modules-label btn btn-success btn-lg rounded-pill text-center d-flex justify-content-center align-items-center gap-2">
        {selectedModule}
      </div>

      <div className="chapter-label btn btn-lg text-center mt-3">
        {secondLine}
      </div>

      <h1 className="fw-bold text-center display-5 mb-4">
        🎮 {t("minigames.select")}
      </h1>

      <div className="d-flex flex-wrap justify-content-center gap-4">
        {games.map((game, i) => {
          const progressKey = `${game.id}_${selectedChapter}`;
          const percent = progressMap[progressKey] || 0;

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              onClick={() => handleGameClick(game)}
              className="game-card text-center rounded shadow"
              style={{ backgroundColor: game.color }}
            >
              <img src={game.icon} alt={game.name} className="game-icon" />
              <div className="fw-semibold game-card-title">{game.name}</div>
              <div className="fw-normal game-card-percentage">{percent}%</div>
            </motion.div>
          );
        })}
      </div>

      {showChoiceModal && selectedGame && (
        <div className="modal-overlay">
          <div className="modal-content choice-modal">
            <div className="modal-gradient"></div>
            <div className="modal-body">
              <div className="choice-modal-title">
                {t("minigames.quizChoice.title")}
              </div>
              <div className="choice-modal-text">
                {postponedCount} {t("minigames.quizChoice.saved")}
              </div>

              <div className="choice-buttons">
                <button
                  className="btn btn-success"
                  onClick={() =>
                    selectedGame.route === "/gapfill"
                      ? handleGapFillPostponedStart()
                      : handlePostponedStart()
                  }
                >
                  {t("minigames.quizChoice.savedPlay")}
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setShowChoiceModal(false);
                    setIsPostponedMode(false);
                    setShowModal(true);
                  }}
                >
                  {t("minigames.quizChoice.random")}
                </button>
              </div>

              <button
                className="choice-back-button"
                onClick={() => setShowChoiceModal(false)}
              >
                {t("common.back")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && selectedGame && (
        <div className="modal-overlay">
          <div className="modal-content d-flex rounded shadow-lg">
            <div className="modal-gradient"></div>
            <div className="p-4 flex-grow-1">
              <h5 className="fw-bold text-success mb-3 text-center">
                {isPostponedMode
                  ? t("minigames.modal.titlePostponed")
                  : t("minigames.modal.title")}
              </h5>

              <div className="position-relative mb-3">
                <label className="form-label mb-1">
                  {isMemory
                    ? t("minigames.modal.pairs")
                    : t("minigames.modal.questions")}
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="form-select"
                >
                  {questionOptions.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>

              <label className="form-label mb-1">
                {t("minigames.modal.timePerQuestion")}
              </label>
              <div className="position-relative mb-4">
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  className="form-select"
                >
                  {[...Array(4).keys()]
                    .map((i) => 5 + i * 5)
                    .concat([...Array(4).keys()].map((i) => 30 + i * 10))
                    .map((val) => (
                      <option key={val} value={val}>
                        {val} {t("minigames.modal.seconds")}
                      </option>
                    ))}
                </select>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline-secondary"
                >
                  {t("common.back")}
                </button>
                <button
                  onClick={handleStart}
                  className="btn btn-success fw-bold"
                >
                  {t("common.start")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Minigames;
