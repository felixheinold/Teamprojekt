import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
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
    subject,
    timeLimit = 20,
    pairs = [],
    isAllChapters,
    chapterCount,
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
            {t("common.cancel")}
          </button>
        ) : (
          <div className="cancel-confirm-container">
            <div className="cancel-confirm-text">
              {t("common.confirmCancel")}
            </div>
            <div className="cancel-confirm-buttons">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCancelConfirm(false)}
              >
                {t("common.no")}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => navigate(-3)}
              >
                {t("common.yesBack")}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="result-content">
        <h1 className="memoryr1result-title">
          {passed
            ? t("memoryround1result.passed")
            : t("memoryround1result.failed")}
        </h1>

        <p className="memoryr1result-subtitle">
          <Trans
            i18nKey="memoryround1result.resultText"
            values={{ percentage, correct: correctCount, total }}
            components={{ strong: <strong /> }}
          />
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
                  state: {
                    module,
                    chapter,
                    subject,
                    pairs,
                    timeLimit,
                    isAllChapters,
                    chapterCount,
                  },
                })
              }
            >
              {t("memoryround1result.next1")}
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
              {t("memoryround1result.retry1")}
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
                    subject,
                    questionCount: pairs.length,
                    pairs,
                    timeLimit,
                    isAllChapters,
                    chapterCount,
                  },
                })
              }
            >
              {t("memoryround1result.retry2")}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="memory2-button"
              style={{ backgroundColor: "#d3bfff" }}
              onClick={() =>
                navigate("/memoryround2", {
                  state: {
                    module,
                    chapter,
                    subject,
                    pairs,
                    timeLimit,
                    isAllChapters,
                    chapterCount,
                  },
                })
              }
            >
              {t("memoryround1result.next2")}
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};

export default MemoryRound1Result;
