import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import "./GapFillResult.css";

const GapFillResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const {
    module,
    subject,
    chapter,
    questionCount,
    timeLimit,
    score = 0,
    correctIds = [],
    allIds = [],
    isAllChapters,
    chapterCount,
    finished,
  } = location.state || {};

  // Sicherheitsabbruch bei direktem Zugriff ohne Spielrunde
  useEffect(() => {
    if (!finished) navigate("/modules");
  }, [finished, navigate]);

  // Fortschritt in localStorage aktualisieren
  useEffect(() => {
    const progressKey = "progress";
    const storedProgress = localStorage.getItem(progressKey);
    const allProgress = storedProgress ? JSON.parse(storedProgress) : {};

    if (!allProgress.gapfillCorrect) allProgress.gapfillCorrect = {};
    if (!allProgress.gapfillTotal) allProgress.gapfillTotal = {};
    if (!allProgress.gapfillCorrect[module])
      allProgress.gapfillCorrect[module] = {};
    if (!allProgress.gapfillTotal[module])
      allProgress.gapfillTotal[module] = {};
    if (!allProgress.gapfillCorrect[module][chapter])
      allProgress.gapfillCorrect[module][chapter] = [];
    if (!allProgress.gapfillTotal[module][chapter])
      allProgress.gapfillTotal[module][chapter] = [];

    const prevCorrect = allProgress.gapfillCorrect[module][chapter];
    const prevTotal = allProgress.gapfillTotal[module][chapter];

    const newCorrect = Array.from(new Set([...prevCorrect, ...correctIds]));
    const newTotal = Array.from(new Set([...prevTotal, ...allIds]));

    allProgress.gapfillCorrect[module][chapter] = newCorrect;
    allProgress.gapfillTotal[module][chapter] = newTotal;

    localStorage.setItem(progressKey, JSON.stringify(allProgress));
  }, [module, chapter, correctIds, allIds]);

  return (
    <div className="gapresult-wrapper">
      <div className="gapresult-image">
        <img src="/images/DinoKIT2.png" alt="Dino" />
      </div>

      <div className="gapresult-text">
        <h1 className="gapresult-title">{t("common.congrats")}</h1>
        <p className="gapresult-score">
          <Trans
            i18nKey="gapfillresult.scoreText"
            values={{ score }}
            components={{ strong: <strong /> }}
          />
        </p>

        <div className="gapresult-buttons">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="gapresult-btn"
            onClick={() =>
              navigate("/gapfill", {
                state: {
                  module,
                  subject,
                  chapter,
                  questionCount,
                  timeLimit,
                  isAllChapters,
                  chapterCount,
                },
              })
            }
          >
            🔁 {t("common.playAgain")}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="gapresult-btn"
            onClick={() =>
              navigate(
                `/minigames/${encodeURIComponent(module)}/${encodeURIComponent(
                  chapter
                )}`,
                {
                  state: {
                    subjectKey: subject,
                    isAllChapters,
                    chapterCount,
                  },
                }
              )
            }
          >
            🎮 {t("common.backToMinigames")}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="gapresult-btn"
            onClick={() => navigate("/modules")}
          >
            📚 {t("common.backToModules")}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default GapFillResult;
