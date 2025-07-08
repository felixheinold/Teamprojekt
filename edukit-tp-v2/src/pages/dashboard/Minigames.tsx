import { useAppFlow } from "../../context/AppFlowContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Minigames.css";

const Minigames = () => {
  const { selectedModule, selectedChapter } = useAppFlow();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [postponedCount, setPostponedCount] = useState(0);

  const [selectedGame, setSelectedGame] = useState<null | {
    name: string;
    route: string;
  }>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15);

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

  const handleGameClick = (game: { name: string; route: string }) => {
    if (game.route === "/quiz") {
      const key = `postponed_${selectedModule}_${selectedChapter}`;
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      const count = stored.length;

      if (count > 0) {
        setSelectedGame(game);
        setPostponedCount(count);
        setShowChoiceModal(true);
      } else {
        // keine zurückgestellten → direkt Standardmodal öffnen
        setSelectedGame(game);
        setShowModal(true);
      }
    } else {
      setSelectedGame(game);
      setShowModal(true);
    }
  };

  const handleStart = () => {
    if (!selectedGame) return;
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
  };

  const handlePostponedStart = () => {
    const key = `postponed_${selectedModule}_${selectedChapter}`;
    const questions = JSON.parse(localStorage.getItem(key) || "[]");

    if (!questions.length) return;

    navigate("/quiz", {
      state: {
        module: selectedModule,
        chapter: selectedChapter,
        questions,
        questionCount: questions.length,
        timeLimit: 20,
        fromPostponed: true,
      },
    });
  };

  const isMemory = selectedGame?.route === "/memory";

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
        {games.map((game, i) => (
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
          </motion.div>
        ))}
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
                  onClick={handlePostponedStart}
                >
                  {t("minigames.quizChoice.savedPlay")}
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setShowChoiceModal(false);
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
                {t("minigames.modal.title")}
              </h5>

              {/* Question Count */}
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
                  {(isMemory
                    ? Array.from({ length: 11 }, (_, i) => i + 5)
                    : Array.from({ length: 10 }, (_, i) => (i + 1) * 2)
                  ).map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Limit */}
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

              {/* Buttons */}
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
