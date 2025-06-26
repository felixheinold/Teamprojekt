import { useAppFlow } from "../../context/AppFlowContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Minigames = () => {
  const { selectedModule, selectedChapter } = useAppFlow();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<null | { name: string; route: string }>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15);

  const fullInfo = selectedChapter?.trim() || "";
  const hasMultiSubjects = fullInfo.length > 0 && !fullInfo.includes(selectedModule);
  const secondLine = hasMultiSubjects ? fullInfo : fullInfo.replace(`${selectedModule} `, "");

  const games = [
    { id: "quiz", name: t("minigames.quiz"), color: "#b6efe1", icon: "/images/quiz.png", route: "/quiz" },
    { id: "memory", name: t("minigames.memory"), color: "#d3bfff", icon: "/images/memory.png", route: "/memory" },
    { id: "gapfill", name: t("minigames.gapfill"), color: "#a4c4f4", icon: "/images/fillgap.png", route: "/gapfill" },
  ];

  const handleGameClick = (game: { name: string; route: string }) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const handleStart = () => {
    if (!selectedGame) return;
    navigate(selectedGame.route, {
      state: {
        module: selectedModule,
        subject: hasMultiSubjects ? fullInfo.split(" Kapitel")[0] : selectedModule,
        chapter: fullInfo,
        questionCount,
        timeLimit,
      },
    });
  };

  const isMemory = selectedGame?.route === "/memory";

  return (
    <div className="container py-4 d-flex flex-column align-items-center">
      <div className="w-100 d-flex justify-content-center mb-3">
        <div className="btn btn-success btn-lg rounded-pill text-center" style={{ maxWidth: "600px", width: "100%", marginTop: "12px" }}>
          {selectedModule}
        </div>
      </div>

      <div className="w-100 d-flex justify-content-center mb-4">
        <div className="btn btn-lg text-center" style={{ maxWidth: "600px", width: "100%", backgroundColor: "#78ba84", fontWeight: "500", border: "none" }}>
          {secondLine}
        </div>
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
            className="text-center rounded shadow"
            style={{
              backgroundColor: game.color,
              width: "220px",
              height: "200px",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <img src={game.icon} alt={game.name} style={{ width: "120px", height: "120px", marginBottom: "1rem" }} />
            <div className="fw-semibold fs-5">{game.name}</div>
          </motion.div>
        ))}
      </div>

      {showModal && selectedGame && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div className="d-flex rounded shadow-lg" style={{
            backgroundColor: "#fff", minWidth: "380px", overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
          }}>
            <div style={{ background: "linear-gradient(180deg, #4a8f5c, #78ba84)", width: "12px" }}></div>

            <div className="p-4 flex-grow-1">
              <h5 className="fw-bold text-success mb-3 text-center">{t("minigames.modal.title")}</h5>

              {/* Question Count */}
              <div className="position-relative mb-3">
                <label className="form-label mb-1">
                  {isMemory ? t("minigames.modal.pairs") : t("minigames.modal.questions")}
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
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>

              {/* Time Limit */}
              <label className="form-label mb-1">{t("minigames.modal.timePerQuestion")}</label>
              <div className="position-relative mb-4">
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  className="form-select"
                >
                  {[...Array(4).keys()].map(i => 5 + i * 5)
                    .concat([...Array(4).keys()].map(i => 30 + i * 10))
                    .map((val) => (
                      <option key={val} value={val}>
                        {val} {t("minigames.modal.seconds")}
                      </option>
                    ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-between mt-3">
                <button onClick={() => setShowModal(false)} className="btn btn-outline-secondary">
                  {t("common.back")}
                </button>
                <button onClick={handleStart} className="btn btn-success fw-bold">
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
