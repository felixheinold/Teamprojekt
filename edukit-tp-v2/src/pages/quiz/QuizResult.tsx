import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import "./QuizResult.css";

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
    <div className="quizresult-wrapper">
      <div className="quizresult-image">
        <img src="/images/DinoKIT2.png" alt="Dino" />
      </div>
      {/* Textbereich */}
      <div className="quizresult-text">
        <h1 className="quizresult-title">🎉 Super, du hast es geschafft!</h1>
        <p className="quizresult-score">
          Du hast <strong>{score}</strong> Punkte gewonnen
        </p>

        <div className="quizresult-buttons">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="quizresult-btn"
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
            className="quizresult-btn"
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
            className="quizresult-btn"
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
