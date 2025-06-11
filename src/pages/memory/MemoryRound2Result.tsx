import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

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
    <div className="container d-flex flex-column justify-content-center align-items-start position-relative"
         style={{ minHeight: "100vh", marginTop: "-20px", paddingBottom: "40px" }}>
      <div style={{ maxWidth: "600px", marginLeft: "20px" }}>
        <h1 className="fw-bold text-center display-5 mb-4">🎉 Super, du hast es geschafft!</h1>
        <p className="fs-4 mb-2 text-center">
          Du hast <strong>{pairs.length}</strong> Paare in <strong>{turns}</strong> Zügen richtig zugeordnet.
        </p>
        <p className="fs-4 mb-4 text-center">Dafür erhältst du <strong>{score}</strong> Punkte.</p>

        <div className="d-flex flex-column gap-3">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                         className="btn fw-bold text-white"
                         style={{ backgroundColor: "#9a7fc6", fontSize: "1.2rem", borderRadius: "12px" }}
                         onClick={() => navigate("/memoryround1", {
                           state: { module, chapter, questionCount: pairs.length, timeLimit, pairs },
                         })}>
            🔁 Kapitel erneut spielen
          </motion.button>

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                         className="btn fw-bold text-white"
                         style={{ backgroundColor: "#9a7fc6", fontSize: "1.2rem", borderRadius: "12px" }}
                         onClick={() => navigate(`/minigames/${encodeURIComponent(module)}/${encodeURIComponent(chapter)}`)}>
            🎮 Zurück zur Minigame Auswahl
          </motion.button>

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                         className="btn fw-bold text-white"
                         style={{ backgroundColor: "#9a7fc6", fontSize: "1.2rem", borderRadius: "12px" }}
                         onClick={() => navigate("/modules")}>
            📚 Zurück zur Modul-Auswahl
          </motion.button>
        </div>
      </div>

      <img src="/images/professor.png" alt="Dozent"
           style={{ position: "absolute", bottom: "100px", right: "40px", height: "450px", pointerEvents: "none" }} />
    </div>
  );
};

export default MemoryRound2Result;
