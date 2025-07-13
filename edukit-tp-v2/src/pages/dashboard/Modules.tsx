import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppFlow } from "../../context/AppFlowContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import UploadForm from "../../components/UploadForm";
import "./Modules.css";

const Modules = () => {
  const { setSelectedModule, setSelectedChapter } = useAppFlow();
  const { t } = useTranslation();

  useEffect(() => {
    setSelectedModule("");
    setSelectedChapter("");
  }, [setSelectedModule, setSelectedChapter]);

  const modules = [
    { key: "production", icon: "📦" },
    { key: "finance", icon: "💰" },
    { key: "management", icon: "📈" },
    { key: "planning", icon: "🏭" },
    { key: "brand", icon: "🏷️" },
  ];

  return (
    <div
      className="modules-wrapper container-fluid py-4 d-flex flex-column align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="text-center fw-bold display-5 mb-4">
        📚 {t("modules.select")}
      </h1>

      <div className="d-flex flex-column align-items-center gap-3 w-100">
        {modules.map(({ key, icon }) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            className="w-100"
          >
            <Link
              to={`/chapters/${key}`}
              onClick={() => {
                setSelectedModule(key);
                setSelectedChapter("");
              }}
              className="btn btn-success btn-lg shadow w-100 text-start d-flex align-items-center gap-3"
            >
              <span style={{ fontSize: "1.5rem" }}>{icon}</span>
              <span>{t(`modules.${key}`)}</span>
            </Link>
          </motion.div>
        ))}

        {/* Hinweis */}
        <div className="disclaimer text-center mt-3">
          ⚠️ {t("modules.disclaimer")}
        </div>

        {/* ⬇️ UploadForm-Komponente eingebunden */}
        <div className="mt-5 w-100">
          <UploadForm />
        </div>
      </div>
    </div>
  );
};

export default Modules;
