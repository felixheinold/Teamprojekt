import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import "./MemoryRound2Result.css";

const MemoryRound2Result = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    module = "",
    chapter = "",
    questionCount = 0,
    timeLimit = 20,
    turns = 0,
    pairs = [],
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
      totalGames: prev.totalGames + 1,
      totalPoints: prev.totalPoints + score,
      maxPoints: prev.maxPoints + maxPoints,
      bestScore: Math.max(prev.bestScore, score),
    };

    allStats[gameKey] = updated;
    localStorage.setItem(statsKey, JSON.stringify(allStats));
    localStorage.setItem("lastPlayed", gameKey);
  }, [score, maxPoints]);

  return (
    <div className="memoryr2result-wrapper">
      <div className="memoryr2result-image">
        <img src="/images/DinoKIT2.png" alt="Dino" />
      </div>

      {/* Textbereich */}
      <div className="memoryr2result-text">
        <h1 className="memoryr2result-title">
          🎉 Super, du hast es geschafft!
        </h1>
        <p className="memoryr2result-score">
          Du hast <strong>{pairs.length}</strong> Paare in{" "}
          <strong>{turns}</strong> Zügen richtig zugeordnet.
        </p>
        <p className="memoryr2result-score">
          Dafür erhältst du <strong>{score}</strong> Punkte.
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
                  questionCount: pairs.length,
                  timeLimit,
                  pairs,
                },
              })
            }
          >
            🔁 Kapitel erneut spielen
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="memoryr2result-btn"
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
            className="memoryr2result-btn"
            onClick={() => navigate("/modules")}
          >
            📚 Zurück zur Modul-Auswahl
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MemoryRound2Result;
