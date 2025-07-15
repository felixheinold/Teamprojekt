import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import "./QuizResult.css";

const QuizResult = () => {
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
    questions = [],
    correctIds = [],
    allIds = [],
    isAllChapters,
    chapterCount,
  } = location.state || {};

  useEffect(() => {
    const statsKey = "userStats";
    const gameKey = "quiz";

    const stored = localStorage.getItem(statsKey);
    const allStats = stored ? JSON.parse(stored) : {};

    const prev = allStats[gameKey] || {
      totalGames: 0,
      totalPoints: 0,
      maxPoints: 0,
      bestScore: 0,
    };

    const updated = {
      totalGames: prev.totalGames + 0.5,
      totalPoints: prev.totalPoints + 0.5 * score,
      maxPoints: prev.maxPoints + 0.5 * questionCount,
      bestScore: Math.max(prev.bestScore, score),
    };

    allStats[gameKey] = updated;
    localStorage.setItem(statsKey, JSON.stringify(allStats));
    localStorage.setItem("lastPlayed", gameKey);

    const progressKey = "progress";
    const storedProgress = localStorage.getItem(progressKey);
    const allProgress = storedProgress ? JSON.parse(storedProgress) : {};

    if (!allProgress.quizCorrect) allProgress.quizCorrect = {};
    if (!allProgress.quizTotal) allProgress.quizTotal = {};
    if (!allProgress.quizCorrect[module]) allProgress.quizCorrect[module] = {};
    if (!allProgress.quizTotal[module]) allProgress.quizTotal[module] = {};
    if (!allProgress.quizCorrect[module][chapter])
      allProgress.quizCorrect[module][chapter] = [];
    if (!allProgress.quizTotal[module][chapter])
      allProgress.quizTotal[module][chapter] = [];

    const prevCorrect = allProgress.quizCorrect[module][chapter];
    const prevTotal = allProgress.quizTotal[module][chapter];

    const newCorrect = Array.from(new Set([...prevCorrect, ...correctIds]));
    const newTotal = Array.from(new Set([...prevTotal, ...allIds]));

    allProgress.quizCorrect[module][chapter] = newCorrect;
    allProgress.quizTotal[module][chapter] = newTotal;

    localStorage.setItem(progressKey, JSON.stringify(allProgress));
  }, [score, questionCount, module, chapter, correctIds, allIds]);

  return (
    <div className="quizresult-wrapper">
      <div className="quizresult-image">
        <img src="/images/DinoKIT2.png" alt="Dino" />
      </div>

      <div className="quizresult-text">
        <h1 className="quizresult-title">{t("common.congrats")}</h1>
        <p className="quizresult-score">
          <Trans
            i18nKey="quizresult.scoreText"
            values={{ score }}
            components={{ strong: <strong /> }}
          />
        </p>

        <div className="quizresult-buttons">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="quizresult-btn"
            onClick={() =>
              navigate("/quiz", {
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
            className="quizresult-btn"
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
            className="quizresult-btn"
            onClick={() => navigate("/modules")}
          >
            📚 {t("common.backToModules")}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
