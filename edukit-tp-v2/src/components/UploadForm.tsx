// src/pages/dashboard/UploadForm.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const chapters = subjects.find((s) => s.subject === selectedSubject)?.chapters || [];

  return (
    <div className="container -mt" style={{ maxWidth: "1000px" }}>
      <h3 className="fw-bold mb-4 text-center">📤 {t("upload.title")}</h3>

      <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
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
          <input
            type="file"
            accept="application/pdf"
            className="form-control"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Button (dünner gestaltet) */}
        <button
          type="submit"
          className="btn btn-primary w-100"
          style={{ paddingTop: "0.45rem", paddingBottom: "0.45rem", fontSize: "1rem" }}
        >
          {t("upload.submit")}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
