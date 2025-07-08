import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppFlow } from "../../context/AppFlowContext";
import { useTranslation } from "react-i18next";
import DisclaimerModal from "../auth/DisclaimerModal";
import "./Home.css";

const Home = () => {
  const { setSelectedModule, setSelectedChapter } = useAppFlow();
  const { t } = useTranslation();

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    setSelectedModule("");
    setSelectedChapter("");

    const disclaimerAccepted = localStorage.getItem("disclaimerAccepted");
    if (disclaimerAccepted !== "true") {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem("disclaimerAccepted", "true");
    setShowDisclaimer(false);
  };

  return (
    <div className="container py-5 home-wrapper position-relative">
      {/* Modal nur anzeigen, wenn nötig */}
      {showDisclaimer && (
        <div className="modal-overlay">
          <DisclaimerModal onAccept={handleAcceptDisclaimer} />
        </div>
      )}

      <div className={`row align-items-center ${showDisclaimer ? 'blur-sm' : ''}`}>
        <motion.div
          className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0 home-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="fw-bold home-title">
            👋 {t("home.welcome")} <span className="text-success">EduKIT</span>
          </h1>
          <p className="text-muted home-subtitle">{t("home.subtitle")}</p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/modules" className="btn btn-success btn-lg shadow home-button">
              📚 {t("home.button")}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="col-lg-6 text-center home-image-wrapper"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <img
            src="/images/DinoKIT1.png"
            alt={t("home.imageAlt")}
            className="img-fluid home-image"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
