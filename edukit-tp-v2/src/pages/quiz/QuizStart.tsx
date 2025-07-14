import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./QuizStart.css";

const QuizStart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const {
    module,
    chapter,
    subject,
    questionCount,
    timeLimit,
    questions,
    isAllChapters = false,
    chapterCount = 1,
  } = location.state || {};

  return (
    <div className="quizstart-wrapper">
      {/* Abbrechen-Button */}
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
                onClick={() => navigate(-1)}
              >
                {t("common.yesBack")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Überschrift mit Icon */}
      <div className="quiz-title-container">
        <h1 className="quiz-title">{t("quizstart.title")}</h1>
        <img
          src="/images/quiz.png"
          alt="Quiz Icon"
          className="quiztutorial-icon"
        />
      </div>

      {/* Tutorial-Box */}
      <div className="quiztutorial-box">
        <div className="quiztutorial-text">🎥 {t("quizstart.tutorial")}</div>
      </div>

      {/* Tutorial Video */}
      <div className="quiztutorial-video">
        <iframe
          src="https://www.youtube.com/embed/0eBODygaYG4"
          title="YouTube Video Tutorial"
          allowFullScreen
        ></iframe>
      </div>

      {/* Start Button */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="quizstart-button-wrapper"
      >
        <Link
          to="/quizgame"
          state={{
            module,
            chapter,
            subject,
            questionCount,
            timeLimit,
            ...(questions ? { questions } : {}),
            isAllChapters,
            chapterCount,
          }}
          className="quizstart-button"
        >
          {t("quizstart.start")}
        </Link>
      </motion.div>
    </div>
  );
};

export default QuizStart;
