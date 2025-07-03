import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
    <div
      className="container d-flex flex-column flex-md-row align-items-center justify-content-center py-5"
      style={{ gap: "2rem" }}
    >
      {/* Bild links */}
      <div className="text-center">
        <img
          src="/images/DinoKIT2.png"
          alt="Dino"
          style={{
            height: "360px",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Textbereich */}
      <div style={{ maxWidth: "500px" }}>
        <h1 className="fw-bold text-center text-md-start display-5 mb-4">
          🎉 Super, du hast es geschafft!
        </h1>
        <p className="fs-4 text-center text-md-start mb-2">
          Du hast <strong>{pairs.length}</strong> Paare in{" "}
          <strong>{turns}</strong> Zügen richtig zugeordnet.
        </p>
        <p className="fs-4 text-center text-md-start mb-4">
          Dafür erhältst du <strong>{score}</strong> Punkte.
        </p>

        <div className="d-flex flex-column gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn fw-bold text-white"
            style={{
              backgroundColor: "#9a7fc6",
              fontSize: "1.2rem",
              borderRadius: "12px",
            }}
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
            className="btn fw-bold text-white"
            style={{
              backgroundColor: "#9a7fc6",
              fontSize: "1.2rem",
              borderRadius: "12px",
            }}
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
            className="btn fw-bold text-white"
            style={{
              backgroundColor: "#9a7fc6",
              fontSize: "1.2rem",
              borderRadius: "12px",
            }}
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
