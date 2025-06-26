import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppFlow } from "../../context/AppFlowContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// Kapitel-Generierung
const generateChapters = (count: number, t: any) =>
  Array.from({ length: count }, (_, i) => ({
    title: `${t("chapters.chapter")} ${i + 1} – ${t("chapters.topic")}`,
  }));

const Chapters = () => {
  const { t } = useTranslation();
  const { moduleName } = useParams(); // <- bekommt den Modul-Key (z.B. "finance")
  const navigate = useNavigate();
  const { setSelectedChapter, setSelectedModule } = useAppFlow();

  useEffect(() => {
    setSelectedChapter("");
    if (moduleName) setSelectedModule(moduleName); // speichere den Key!
  }, [moduleName, setSelectedChapter, setSelectedModule]);

  const moduleIcons: Record<string, string> = {
    production: "📦",
    finance: "💰",
    management: "📊",
    planning: "🏭",
    economics2: "📉",
    economics1: "📈",
  };

  const moduleData: Record<
    string,
    { subject: string; chapters: { title: string }[] }[]
  > = {
    production: [
      { subject: t("subjects.production"), chapters: generateChapters(5, t) },
      { subject: t("subjects.logistics"), chapters: generateChapters(5, t) },
      { subject: t("subjects.energy"), chapters: generateChapters(5, t) },
    ],
    finance: [
      { subject: t("subjects.finance"), chapters: generateChapters(5, t) },
      { subject: t("subjects.accounting"), chapters: generateChapters(5, t) },
      { subject: t("subjects.balance"), chapters: generateChapters(5, t) },
    ],
    management: [
      { subject: t("subjects.management"), chapters: generateChapters(5, t) },
      { subject: t("subjects.entrepreneurship"), chapters: generateChapters(5, t) },
      { subject: t("subjects.hr"), chapters: generateChapters(5, t) },
      { subject: t("subjects.marketing"), chapters: generateChapters(5, t) },
    ],
    planning: [
      { subject: t("subjects.integratedPlanning"), chapters: generateChapters(5, t) },
    ],
    economics2: [
      { subject: t("subjects.economics2"), chapters: generateChapters(5, t) },
    ],
    economics1: [
      { subject: t("subjects.economics1"), chapters: generateChapters(5, t) },
    ],
  };

  const entries = moduleData[moduleName || ""] || [];

  return (
    <div className="container py-4">
      <h1 className="text-center fw-bold display-5 mb-4">
        📖 {t("chapters.selectSubchapter")}
      </h1>

      <div className="d-flex justify-content-center mb-3">
        <div className="btn btn-success btn-lg rounded-pill text-center d-flex justify-content-center align-items-center gap-2"
          style={{ maxWidth: "600px", width: "100%" }}>
          <span style={{ fontSize: "1.5rem" }}>{moduleIcons[moduleName || ""]}</span>
          <span>{t(`modules.${moduleName}`)}</span>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center gap-4">
        {entries.map((entry, i) => (
          <div key={i} className="w-100" style={{ maxWidth: "600px" }}>
            {entries.length > 1 && (
              <h5 className="fw-bold text-center mb-3">{entry.subject}</h5>
            )}

            {entry.chapters.map((ch, j) => (
              <motion.div
                key={j}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                className="mb-2"
              >
                <button
                  onClick={() => {
                    setSelectedChapter(`${entry.subject} ${ch.title}`);
                    navigate(
                      `/minigames/${moduleName}/${encodeURIComponent(`${entry.subject} ${ch.title}`)}`
                    );
                  }}
                  className="btn btn-lg shadow w-100 text-center"
                  style={{
                    backgroundColor: "#78ba84",
                    border: "none",
                    color: "#000",
                    fontWeight: "500",
                  }}
                >
                  {ch.title}
                </button>
              </motion.div>
            ))}

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              className="mb-2"
            >
              <button
                onClick={() => {
                  setSelectedChapter(t("chapters.allChapters"));
                  navigate(
                    `/minigames/${moduleName}/${encodeURIComponent(t("chapters.allChapters"))}`
                  );
                }}
                className="btn btn-lg shadow w-100 text-center"
                style={{
                  backgroundColor: "#78ba84",
                  border: "none",
                  color: "#000",
                  fontWeight: "500",
                }}
              >
                {t("chapters.learnAll")}
              </button>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chapters;
