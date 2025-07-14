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
    { key: "economics2", icon: "📉" },
    { key: "economics1", icon: "📈" },
  ];

  return (
    <div
      className="modules-wrapper container-fluid py-4 d-flex flex-column align-items-center"
      style={{ minHeight: "100vh" }}
    >
      {/* Hauptüberschrift */}
      <h1 className="text-center fw-bold display-5 mb-3">
        📚 {t("modules.select")}
      </h1>

      {/* Scroll-Hinweis */}
      <div className="upload-scroll-hint text-center fw-semibold text-secondary mb-2">
        ℹ️ Scrolle nach unten, um ein PDF hochzuladen
      </div>

      {/* Veraltet-Hinweis direkt danach */}
      <div className="text-muted text-center mb-4 disclaimer">
        ⚠️ {t("modules.disclaimer")}
      </div>

      {/* Modulbuttons */}
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

        {/* Upload-Hinweise + Formular im synchronisierten Layout */}
        <div className="mt-5 w-100 d-flex flex-column align-items-center">
          {/* Hinweis-Box mit angepasster Breite */}
          <div className="upload-note-wrapper mb-4">
            <div className="upload-note p-3 rounded">
              <strong className="d-block mb-2">📌 Hinweise zum Upload:</strong>
              <ul className="mb-0 ps-3">
                <li>Lade nur <strong>PDF-Dokumente</strong> hoch.</li>
                <li>Lade <strong>jedes Dokument einzeln</strong> hoch.</li>
                <li>Stelle sicher, dass das Dokument <strong>ein komplettes Kapitel</strong> abdeckt.</li>
                <li><strong>Keine mathematischen Formeln</strong> oder Formelsammlungen hochladen.</li>
              </ul>
            </div>
          </div>

          {/* Upload-Formular */}
          <div className="upload-card">
            <UploadForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modules;
