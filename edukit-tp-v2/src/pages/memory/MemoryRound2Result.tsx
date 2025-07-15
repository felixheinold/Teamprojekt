import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import "./MemoryRound2Result.css";

const MemoryRound2Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const {
    module = "",
    chapter = "",
    subject,
    questionCount = 0,
    timeLimit = 20,
    turns = 0,
    pairs = [],
    isAllChapters,
    chapterCount,
  } = location.state || {};

  const basePoints = pairs.length;
  const maxPoints = basePoints * 4;
  const extraTurns = Math.max(0, turns - basePoints);
  const score = Math.max(basePoints, maxPoints - extraTurns * 2);

  useEffect(() => {
    const statsKey = "userStats";
    const gameKey = "memory";

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
      maxPoints: prev.maxPoints + 0.5 * maxPoints,
      bestScore: Math.max(prev.bestScore, score),
    };

    allStats[gameKey] = updated;
    localStorage.setItem(statsKey, JSON.stringify(allStats));
    localStorage.setItem("lastPlayed", gameKey);

    const progressKey = "progress";
    const storedProgress = localStorage.getItem(progressKey);
    const allProgress = storedProgress ? JSON.parse(storedProgress) : {};

    if (!allProgress.memory) allProgress.memory = {};
    if (!allProgress.memory[module]) allProgress.memory[module] = {};
    if (!allProgress.memory[module][chapter])
      allProgress.memory[module][chapter] = [];

    const prevIds: string[] = allProgress.memory[module][chapter];
    const newIds: string[] = pairs.map((p: any) => p.id);
    const combined = Array.from(new Set([...prevIds, ...newIds]));
    allProgress.memory[module][chapter] = combined;

    localStorage.setItem(progressKey, JSON.stringify(allProgress));
  }, [score, maxPoints, pairs, module, chapter]);

  return (
    <div className="memoryr2result-wrapper">
      <div className="memoryr2result-image">
        <img src="/images/DinoKIT2.png" alt="Dino" />
      </div>

      <div className="memoryr2result-text">
        <h1 className="memoryr2result-title">{t("common.congrats")}</h1>

        <p className="memoryr2result-score">
          <Trans
            i18nKey="memoryround2result.pairsScored"
            values={{ count: pairs.length, turns }}
            components={{ strong: <strong /> }}
          />
        </p>

        <p className="memoryr2result-score">
          <Trans
            i18nKey="memoryround2result.scoreText"
            values={{ score }}
            components={{ strong: <strong /> }}
          />
        </p>

        <div className="memoryr2result-buttons">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="memoryr2result-btn"
            onClick={() =>
              navigate("/memoryround1", {
                state: {
                  module,
                  chapter,
                  subject,
                  questionCount: pairs.length,
                  timeLimit,
                  pairs,
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
            className="memoryr2result-btn"
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
            className="memoryr2result-btn"
            onClick={() => navigate("/modules")}
          >
            📚 {t("common.backToModules")}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MemoryRound2Result;
