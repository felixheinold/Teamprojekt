import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import "./GapFillResult.css";

const GapFillResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    module,
    subject,
    chapter,
    questionCount,
    timeLimit,
    score = 0,
    correctIds = [],
    questions = [],
    allIds = [],
  } = location.state || {};

  useEffect(() => {
    const statsKey = "userStats";
    const gameKey = "gapfill";

    const stored = localStorage.getItem(statsKey);
    const allStats = stored ? JSON.parse(stored) : {};

    const prev = allStats[gameKey] || {
      totalGames: 0,
      totalPoints: 0,
      maxPoints: 0,
      bestScore: 0,
    };

    const updated = {
      totalGames: prev.totalGames + 1,
      totalPoints: prev.totalPoints + score,
      maxPoints: prev.maxPoints + questionCount,
      bestScore: Math.max(prev.bestScore, score),
    };

    allStats[gameKey] = updated;
    localStorage.setItem(statsKey, JSON.stringify(allStats));
    localStorage.setItem("lastPlayed", gameKey);

    // 🧠 Fortschritt speichern
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
  }, [score, questionCount, module, chapter, correctIds, allIds]);

  return (
    <div className="gapresult-wrapper">
      <div className="gapresult-image">
        <img src="/images/DinoKIT2.png" alt="Dino" />
      </div>

      <div className="gapresult-text">
        <h1 className="gapresult-title">🎉 Super, du hast es geschafft!</h1>
        <p className="gapresult-score">
          Du hast <strong>{score}</strong> Punkte gewonnen
        </p>

        <div className="gapresult-buttons">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="gapresult-btn"
            onClick={() =>
              navigate("/gapfill", {
                state: { module, subject, chapter, questionCount, timeLimit },
              })
            }
          >
            🔁 Erneut spielen
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="gapresult-btn"
            onClick={() =>
              navigate(
                `/minigames/${encodeURIComponent(module)}/${encodeURIComponent(
                  chapter
                )}`
              )
            }
          >
            🎮 Zurück zur Minigame Auswahl
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="gapresult-btn"
            onClick={() => navigate("/modules")}
          >
            📚 Zurück zur Modul-Auswahl
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default GapFillResult;
