import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppFlow } from "../../context/AppFlowContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const generateChapters = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    title: `Kapitel ${i + 1} – Thema XY`,
  }));

const moduleIcons: Record<string, string> = {
  "Produktion und Logistik": "📦",
  "Finanzierung und Rechnungswesen": "💰",
  "Management und Marketing": "📊",
  "Integrierte Produktionsplanung": "🏭",
  "Volkswirtschaftslehre 2": "📉",
  "Volkswirtschaftslehre 1": "📈",
};

const moduleData: Record<
  string,
  { subject: string; chapters: { title: string }[] }[]
> = {
  "Produktion und Logistik": [
    { subject: "Produktion", chapters: generateChapters(5) },
    { subject: "Logistik", chapters: generateChapters(5) },
    { subject: "Energiewirtschaft", chapters: generateChapters(5) },
  ],
  "Finanzierung und Rechnungswesen": [
    { subject: "Finanzierung", chapters: generateChapters(5) },
    { subject: "Rechnungswesen", chapters: generateChapters(5) },
    { subject: "Jahresabschluss und Bewertung", chapters: generateChapters(5) },
  ],
  "Management und Marketing": [
    { subject: "Unternehmensführung", chapters: generateChapters(5) },
    { subject: "Entrepreneurship", chapters: generateChapters(5) },
    { subject: "HR-Management", chapters: generateChapters(5) },
    { subject: "Marketing", chapters: generateChapters(5) },
  ],
  "Integrierte Produktionsplanung": [
    {
      subject: "Integrierte Produktionsplanung",
      chapters: generateChapters(5),
    },
  ],
  "Volkswirtschaftslehre 2": [
    { subject: "Volkswirtschaftslehre 2", chapters: generateChapters(5) },
  ],
  "Volkswirtschaftslehre 1": [
    { subject: "Volkswirtschaftslehre 1", chapters: generateChapters(5) },
  ],
};

const Chapters = () => {
  const { moduleName } = useParams();
  const decoded = decodeURIComponent(moduleName || "");
  const entries = moduleData[decoded] || [];

  const { setSelectedChapter } = useAppFlow();
  const navigate = useNavigate();
  useEffect(() => {
    setSelectedChapter("");
  }, []);

  return (
    <div className="container py-4">
      <h1 className="text-center fw-bold display-5 mb-4">
        📖 Wähle ein Unterkapitel aus
      </h1>

      {/* Modulbox mit angepasster Breite */}
      <div className="d-flex justify-content-center mb-3">
        <div
          className="btn btn-success btn-lg rounded-pill text-center d-flex justify-content-center align-items-center gap-2"
          style={{ maxWidth: "600px", width: "100%" }}
        >
          <span style={{ fontSize: "1.5rem" }}>{moduleIcons[decoded]}</span>
          <span>{decoded}</span>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center gap-4">
        {entries.map((entry, i) => {
          const isOnlySubject =
            entries.length === 1 && entry.subject === decoded;

          return (
            <div key={i} className="w-100" style={{ maxWidth: "600px" }}>
              {/* Nur anzeigen, wenn Fachname ≠ Modulname oder mehrere Fächer */}
              {!isOnlySubject && (
                <h5 className="fw-bold text-center mb-3">{entry.subject}</h5>
              )}

              {entry.chapters.map((ch, j) => (
                <motion.div
                  key={j}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    type: "tween",
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="mb-2"
                >
                  <button
                    onClick={() => {
                      setSelectedChapter(`${entry.subject} ${ch.title}`);
                      navigate(
                        `/minigames/${encodeURIComponent(
                          decoded
                        )}/${encodeURIComponent(
                          entry.subject + " " + ch.title
                        )}`
                      );
                    }}
                    className="btn btn-lg shadow w-100 text-center"
                    style={{
                      boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
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
                transition={{
                  type: "tween",
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="mb-2"
              >
                <button
                  onClick={() => {
                    setSelectedChapter("Alle Kapitel");
                    navigate(
                      `/minigames/${encodeURIComponent(decoded)}/Alle Kapitel`
                    );
                  }}
                  className="btn btn-lg shadow w-100 text-center"
                  style={{
                    boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#78ba84",
                    border: "none",
                    color: "#000",
                    fontWeight: "500",
                  }}
                >
                  Alle Kapitel lernen
                </button>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chapters;
