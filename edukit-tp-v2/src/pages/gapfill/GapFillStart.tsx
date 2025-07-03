import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const GapfillStart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { module, chapter, subject, questionCount, timeLimit } =
    (location.state as {
      module?: string;
      chapter?: string;
      subject?: string;
      questionCount?: number;
      timeLimit?: number;
    }) || {};

  return (
    <div
      className="container d-flex flex-column align-items-center pt-4"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="position-absolute"
        style={{ top: "80px", left: "30px", zIndex: 10 }}
      >
        {!showCancelConfirm ? (
          <button
            className="btn btn-dark"
            onClick={() => setShowCancelConfirm(true)}
          >
            Abbrechen
          </button>
        ) : (
          <div className="d-flex flex-column gap-2">
            <div className="text-white bg-dark rounded px-3 py-2">
              Möchtest du wirklich abbrechen?
            </div>
            <div className="d-flex gap-2">
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

      <h1 className="text-center fw-bold display-5 mb-2">Lückentext</h1>

      <div
        className="d-flex align-items-center justify-content-between mb-2"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <div
          className="py-2 px-3 fw-bold text-center flex-grow-1"
          style={{
            backgroundColor: "#a4c4f4",
            borderRadius: "30px",
            fontSize: "1.25rem",
            color: "#000",
          }}
        >
          <img
            src="/images/fillgap.png"
            alt="Gapfill Icon"
            className="position-absolute"
            style={{
              top: "85px",
              right: "470px",
              height: "80px",
              width: "80px",
              objectFit: "contain",
              zIndex: 10,
            }}
          />
          🎥 Video Tutorial anschauen:
        </div>
      </div>

      <div
        className="mb-3"
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "280px",
          backgroundColor: "#ddd",
        }}
      >
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube Video Tutorial"
          allowFullScreen
          style={{ border: "none" }}
        ></iframe>
      </div>

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{ width: "100%", maxWidth: "600px" }}
      >
        <Link
          to="/gapfillgame"
          state={{ module, chapter, subject, questionCount, timeLimit }}
          className="fw-bold text-white d-block text-center py-2"
          style={{
            backgroundColor: "#5989d6",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.3rem",
            textDecoration: "none",
          }}
        >
          Direkt zum Lückentext starten
        </Link>
      </motion.div>
    </div>
  );
};

export default GapfillStart;
