import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const QuizResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    module,
    subject,
    chapter,
    questionCount,
    timeLimit,
    score = 0,
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
      totalGames: prev.totalGames + 1,
      totalPoints: prev.totalPoints + score,
      maxPoints: prev.maxPoints + questionCount,
      bestScore: Math.max(prev.bestScore, score),
    };

    allStats[gameKey] = updated;
    localStorage.setItem(statsKey, JSON.stringify(allStats));
    localStorage.setItem("lastPlayed", gameKey); // Zuletzt gespielt speichern
  }, [score, questionCount]);

  return (
    <div className="container d-flex flex-column justify-content-center align-items-start position-relative"
         style={{ minHeight: "100vh", marginTop: "-20px", paddingBottom: "40px" }}>
      <div style={{ maxWidth: "600px", marginLeft: "20px" }}>
        <h1 className="fw-bold text-center display-5 mb-4">🎉 Super, du hast es geschafft!</h1>
        <p className="fs-4 mb-4 text-center">Du hast <strong>{score}</strong> Punkte gewonnen</p>

        <div className="d-flex flex-column gap-3">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                         className="btn fw-bold text-white"
                         style={{ backgroundColor: "#5ac0f0", fontSize: "1.2rem", borderRadius: "12px" }}
                         onClick={() => navigate("/quiz", { state: { module, subject, chapter, questionCount, timeLimit } })}>
            🔁 Erneut spielen
          </motion.button>

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                         className="btn fw-bold text-white"
                         style={{ backgroundColor: "#5ac0f0", fontSize: "1.2rem", borderRadius: "12px" }}
                         onClick={() => navigate(`/minigames/${encodeURIComponent(module)}/${encodeURIComponent(chapter)}`)}>
            🎮 Zurück zur Minigame Auswahl
          </motion.button>

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                         className="btn fw-bold text-white"
                         style={{ backgroundColor: "#5ac0f0", fontSize: "1.2rem", borderRadius: "12px" }}
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

export default QuizResult;
