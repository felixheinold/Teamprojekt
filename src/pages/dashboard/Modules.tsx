import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppFlow } from "../../context/AppFlowContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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
    { key: "management", icon: "📊" },
    { key: "planning", icon: "🏭" },
    { key: "economics2", icon: "📉" },
    { key: "economics1", icon: "📈" },
  ];

  return (
    <div
      className="container py-4 d-flex flex-column align-items-center"
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
            style={{ maxWidth: "600px" }}
          >
            <Link
              to={`/chapters/${key}`}
              onClick={() => {
                setSelectedModule(key); // Nutze den internen Key
                setSelectedChapter("");
              }}
              className="btn btn-success btn-lg shadow w-100 text-start d-flex align-items-center gap-3"
            >
              <span style={{ fontSize: "1.5rem" }}>{icon}</span>
              <span>{t(`modules.${key}`)}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Modules;
