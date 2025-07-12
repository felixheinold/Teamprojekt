// src/pages/dashboard/UploadForm.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./UploadForm.css";

const moduleData: Record<
  string,
  { subject: string; chapters: { title: string }[] }[]
> = {
  production: [
    {
      subject: "production",
      chapters: [{ title: "Kapitel 1" }, { title: "Kapitel 2" }],
    },
  ],
  finance: [
    {
      subject: "finance",
      chapters: [{ title: "Kapitel 1" }, { title: "Kapitel 2" }],
    },
  ],
};

const UploadForm = () => {
  const { t } = useTranslation();

  const [selectedModule, setSelectedModule] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !selectedModule || !selectedSubject || !selectedChapter) {
      alert(t("upload.missingFields"));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", selectedModule);
    formData.append("subject", selectedSubject);
    formData.append("chapter", selectedChapter);

    console.log("Upload gestartet:", {
      selectedModule,
      selectedSubject,
      selectedChapter,
      file,
    });

    alert(t("upload.success"));
  };

  const subjects = moduleData[selectedModule] || [];
  const chapters =
    subjects.find((s) => s.subject === selectedSubject)?.chapters || [];

  return (
    <div className="upload-wrapper">
      <div className="upload-card">
        <h3 className="upload-title">📤 {t("upload.title")}</h3>

        <form onSubmit={handleSubmit}>
          {/* Modul */}
          <div className="mb-3">
            <label className="form-label">{t("upload.module")}</label>
            <select
              className="form-select"
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setSelectedSubject("");
                setSelectedChapter("");
              }}
            >
              <option value="">{t("upload.selectModule")}</option>
              {Object.keys(moduleData).map((mod) => (
                <option key={mod} value={mod}>
                  {t(`modules.${mod}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Vorlesung */}
          <div className="mb-3">
            <label className="form-label">{t("upload.subject")}</label>
            <select
              className="form-select"
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedChapter("");
              }}
              disabled={!selectedModule}
            >
              <option value="">{t("upload.selectSubject")}</option>
              {subjects.map((s, i) => (
                <option key={i} value={s.subject}>
                  {t(`subjects.${s.subject}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Kapitel */}
          <div className="mb-3">
            <label className="form-label">{t("upload.chapter")}</label>
            <select
              className="form-select"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              disabled={!selectedSubject}
            >
              <option value="">{t("upload.selectChapter")}</option>
              {chapters.map((ch, i) => (
                <option key={i} value={ch.title}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Datei */}
          <div className="mb-3">
            <label className="form-label">{t("upload.file")}</label>
            <div
              className="form-select d-flex justify-content-between align-items-center"
              style={{ position: "relative", paddingRight: "2rem" }}
            >
              <label
                htmlFor="fileInput"
                style={{
                  width: "100%",
                  margin: 0,
                  cursor: "pointer",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  zIndex: 1,
                }}
              >
                {file ? file.name : t("upload.noFileSelected")}
              </label>

              {file && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  aria-label={t("upload.removeFile")}
                  title={t("upload.removeFile")}
                >
                  &times;
                </button>
              )}

              <input
                id="fileInput"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: file ? "calc(100% - 3rem)" : "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                  zIndex: 0,
                }}
              />
            </div>
          </div>

          {/* Button */}
          <button type="submit" className="btn btn-primary w-100">
            {t("upload.submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
