import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./MemoryRound1Result.css";

const MemoryRound1Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const {
    correctCount = 0,
    total = 1,
    module,
    chapter,
    timeLimit = 20,
    pairs = [],
  } = location.state || {};

  const percentage = Math.round((correctCount / total) * 100);
  const passed = percentage >= 66;

  return (
    <div className="memoryr1result-wrapper">
      {/* Abbrechen-Button mit Bestätigung */}
      <div className="cancel-button">
        {!showCancelConfirm ? (
          <button
            className="btn btn-dark"
            onClick={() => setShowCancelConfirm(true)}
          >
            Abbrechen
          </button>
        ) : (
          <div className="cancel-confirm-container">
            <div className="cancel-confirm-text">
              Möchtest du wirklich abbrechen?
            </div>
            <div className="cancel-confirm-buttons">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCancelConfirm(false)}
              >
                Nein
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => navigate(-3)}
              >
                Ja, zurück
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="result-content">
        <h1 className="memoryr1result-title">
          {passed
            ? "🎉 Gut gemacht! Du bist für die nächste Runde vorbereitet"
            : "🔁 Das solltest du besser nochmal üben..."}
        </h1>

        <p className="memoryr1result-subtitle">
          Du hast <strong>{percentage}%</strong> ({correctCount} von {total})
          richtig zugeordnet.
        </p>

        {passed ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="memory1-button"
              style={{ backgroundColor: "#9a7fc6" }}
              onClick={() =>
                navigate("/memoryround2", {
                  state: { module, chapter, pairs, timeLimit },
                })
              }
            >
              ➡️ Weiter zu Runde 2
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="memory2-button"
              style={{ backgroundColor: "#d3bfff" }}
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
              🔁 Runde 1 erneut spielen
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="memory1-button"
              style={{ backgroundColor: "#9a7fc6" }}
              onClick={() =>
                navigate("/memoryround1", {
                  state: {
                    module,
                    chapter,
                    questionCount: pairs.length,
                    pairs,
                    timeLimit,
                  },
                })
              }
            >
              🔁 Versuche es nochmal
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="memory2-button"
              style={{ backgroundColor: "#d3bfff" }}
              onClick={() =>
                navigate("/memoryround2", {
                  state: { module, chapter, pairs, timeLimit },
                })
              }
            >
              ➡️ Trotzdem weiter zu Runde 2
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};

export default MemoryRound1Result;
