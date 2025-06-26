import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppFlow } from "../../context/AppFlowContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Modules = () => {
  const { setSelectedModule, setSelectedChapter } = useAppFlow();
  const { t } = useTranslation();

  const [uploadModule, setUploadModule] = useState("");
  const [uploadChapter, setUploadChapter] = useState("");
  const [file, setFile] = useState<File | null>(null);

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

  const chapters = ["chapter1", "chapter2", "chapter3"]; // Optional dynamisch

  const handleUpload = () => {
    if (!uploadModule || !uploadChapter || !file) {
      alert("Bitte Modul, Kapitel und Datei angeben.");
      return;
    }
    // Beispielhafte Verarbeitung:
    console.log("Uploading:", {
      module: uploadModule,
      chapter: uploadChapter,
      file,
    });
    alert(`PDF erfolgreich hochgeladen für ${uploadModule} - ${uploadChapter}`);
    // Reset
    setUploadModule("");
    setUploadChapter("");
    setFile(null);
  };

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

        {/* Upload-Bereich */}
        <div className="card mt-5 p-4 w-100" style={{ maxWidth: "600px" }}>
          <h5 className="mb-3">{t("modules.uploadTitle") || "📤 PDF hochladen"}</h5>
          <div className="mb-3">
            <label className="form-label">Modul</label>
            <select
              className="form-select"
              value={uploadModule}
              onChange={(e) => setUploadModule(e.target.value)}
            >
              <option value="">Modul wählen</option>
              {modules.map(({ key }) => (
                <option key={key} value={key}>
                  {t(`modules.${key}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Kapitel</label>
            <select
              className="form-select"
              value={uploadChapter}
              onChange={(e) => setUploadChapter(e.target.value)}
            >
              <option value="">Kapitel wählen</option>
              {chapters.map((chapter) => (
                <option key={chapter} value={chapter}>
                  {t(`chapters.${chapter}`) || chapter}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">PDF auswählen</label>
            <input
              type="file"
              className="form-control"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={handleUpload}>
            Hochladen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modules;
