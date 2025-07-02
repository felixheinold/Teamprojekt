import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppFlow } from "../../context/AppFlowContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { setSelectedModule, setSelectedChapter } = useAppFlow();
  const { t } = useTranslation();

  useEffect(() => {
    setSelectedModule("");
    setSelectedChapter("");
  }, []);

  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Textbereich mit Animation */}
        <motion.div
          className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="display-5 fw-bold mb-3">
            👋 {t("home.welcome")} <span className="text-success">EduKIT</span>
          </h1>
          <p className="lead text-muted mb-4">{t("home.subtitle")}</p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/modules" className="btn btn-success btn-lg shadow">
              📚 {t("home.button")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Bildbereich */}
        <motion.div
          className="col-lg-6 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <img
            src="/images/DinoKIT1.png"
            alt={t("home.imageAlt")}
            className="img-fluid"
            style={{ maxHeight: "350px" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
