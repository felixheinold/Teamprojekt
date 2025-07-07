import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./GapFillStart.css";

const GapFillStart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { module, chapter, subject, questionCount, timeLimit } =
    location.state || {};

  return (
    <div className="gapfillstart-wrapper">
      {/* Abbrechen-Button */}
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
                onClick={() => navigate(-1)}
              >
                Ja, zurück
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Überschrift mit Icon */}
      <div className="gap-title-container">
        <h1 className="gap-title">LÜCKENTEXT</h1>
        <img
          src="/images/fillgap.png"
          alt="Gapfill Icon"
          className="gaptutorial-icon"
        />
      </div>

      {/* Tutorial-Box */}
      <div className="gaptutorial-box">
        <div className="gaptutorial-text">🎥 Video Tutorial anschauen:</div>
      </div>

      {/* Tutorial Video */}
      <div className="gaptutorial-video">
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube Video Tutorial"
          allowFullScreen
        ></iframe>
      </div>

      {/* Start Button */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="gapstart-button-wrapper"
      >
        <Link
          to="/gapfillgame"
          state={{ module, chapter, subject, questionCount, timeLimit }}
          className="gapstart-button"
        >
          Direkt zum Lückentext starten
        </Link>
      </motion.div>
    </div>
  );
};

export default GapFillStart;
