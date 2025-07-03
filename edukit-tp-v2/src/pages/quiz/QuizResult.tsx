import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
    localStorage.setItem("lastPlayed", gameKey);
  }, [score, questionCount]);

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
        <p className="fs-4 mb-4 text-center text-md-start">
          Du hast <strong>{score}</strong> Punkte gewonnen
        </p>

        <div className="d-flex flex-column gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn fw-bold text-white"
            style={{
              backgroundColor: "#5ac0f0",
              fontSize: "1.2rem",
              borderRadius: "12px",
            }}
            onClick={() =>
              navigate("/quiz", {
                state: { module, subject, chapter, questionCount, timeLimit },
              })
            }
          >
            🔁 Erneut spielen
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn fw-bold text-white"
            style={{
              backgroundColor: "#5ac0f0",
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
              backgroundColor: "#5ac0f0",
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

export default QuizResult;
