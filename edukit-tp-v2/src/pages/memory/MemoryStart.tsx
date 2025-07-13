import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./MemoryStart.css";

const MemoryStart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { module, chapter, subject, questionCount, timeLimit } =
    location.state || {};

  return (
    <div className="memorystart-wrapper">
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
                className="btn btn-secondary"
                onClick={() => setShowCancelConfirm(false)}
              >
                {t("common.no")}
              </button>
              <button className="btn btn-danger" onClick={() => navigate(-1)}>
                {t("common.yesBack")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Titel */}
      <div className="memory-title-container">
        <h1 className="memory-title">{t("memorystart.title")}</h1>
        <img
          src="/images/memory.png"
          alt="Memory Icon"
          className="memorytutorial-icon"
        />
      </div>

      {/* Tutorial-Box */}
      <div className="memorytutorial-box">
        <div className="memorytutorial-text">
          🎥 {t("memorystart.tutorial")}
        </div>
      </div>

      {/* Video */}
      <div className="memorytutorial-video">
        <iframe
          src="https://www.youtube.com/embed/qB-byrsIKdo"
          title="YouTube Video Tutorial"
          allowFullScreen
        ></iframe>
      </div>

      {/* Start Button */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="memorystart-button-wrapper"
      >
        <Link
          to="/memoryround1"
          state={{ module, chapter, subject, questionCount, timeLimit }}
          className="memorystart-button"
        >
          {t("memorystart.start")}
        </Link>
      </motion.div>
    </div>
  );
};

export default MemoryStart;
