import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppFlow } from "../../context/AppFlowContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Chapters.css";

const generateChapters = (count: number, t: any) =>
  Array.from({ length: count }, (_, i) => ({
    title: `${t("chapters.chapter")} ${i + 1} – ${t("chapters.topic")}`,
  }));

const Chapters = () => {
  const { t } = useTranslation();
  const { moduleName } = useParams();
  const navigate = useNavigate();
  const { setSelectedChapter, setSelectedModule } = useAppFlow();
  const [chapterProgress, setChapterProgress] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (!moduleName) return;

    setSelectedChapter("");
    setSelectedModule(moduleName);

    const progress = JSON.parse(localStorage.getItem("progress") || "{}");
    const progressMap: Record<string, number[]> = {};
    const categories = ["quiz", "gapfill", "memory"];

    categories.forEach((category) => {
      if (category === "memory") {
        const memoryData = progress.memory?.[moduleName] || {};
        Object.entries(memoryData).forEach(([chapterKey, ids]) => {
          const correct = Array.isArray(ids) ? ids.length : 0;
          const total =
            progress.memoryTotal?.[moduleName]?.[chapterKey]?.length || 0;
          const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

          if (!progressMap[chapterKey]) progressMap[chapterKey] = [];
          progressMap[chapterKey].push(percent);
        });
      } else {
        const correctData =
          progress?.[`${category}Correct`]?.[moduleName] || {};
        const totalData = progress?.[`${category}Total`]?.[moduleName] || {};

        const allChapters = new Set([
          ...Object.keys(correctData),
          ...Object.keys(totalData),
        ]);

        allChapters.forEach((chapterKey) => {
          const correct = Array.isArray(correctData[chapterKey])
            ? correctData[chapterKey].length
            : 0;
          const total = Array.isArray(totalData[chapterKey])
            ? totalData[chapterKey].length
            : 0;
          const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

          if (!progressMap[chapterKey]) progressMap[chapterKey] = [];
          progressMap[chapterKey].push(percent);
        });
      }
    });

    const averageProgress: Record<string, number> = {};
    Object.entries(progressMap).forEach(([chapter, percents]) => {
      const filled = [...percents];
      while (filled.length < 3) filled.push(0);
      const sum = filled.reduce((a, b) => a + b, 0);
      averageProgress[`${moduleName}_${chapter}`] = Math.round(sum / 3);
    });

    setChapterProgress(averageProgress);
  }, [moduleName, setSelectedChapter, setSelectedModule]);

  if (!moduleName) return null;

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
      {
        subject: t("subjects.entrepreneurship"),
        chapters: generateChapters(5, t),
      },
      { subject: t("subjects.hr"), chapters: generateChapters(5, t) },
      { subject: t("subjects.marketing"), chapters: generateChapters(5, t) },
    ],
    planning: [
      {
        subject: t("subjects.planning"),
        chapters: generateChapters(5, t),
      },
    ],
    economics2: [
      { subject: t("subjects.economics2"), chapters: generateChapters(5, t) },
    ],
    economics1: [
      { subject: t("subjects.economics1"), chapters: generateChapters(5, t) },
    ],
  };

  const entries = moduleData[moduleName] || [];

  return (
    <div className="chapters-wrapper container py-4 d-flex flex-column align-items-center">
      <h1 className="text-center fw-bold display-5 mb-4">
        📖 {t("chapters.selectSubchapter")}
      </h1>
      <div className="module-label btn btn-success btn-lg rounded-pill text-center d-flex justify-content-center align-items-center gap-2">
        <span>{moduleIcons[moduleName]}</span>
        <span>{t(`modules.${moduleName}`)}</span>
      </div>

      <div className="d-flex flex-column align-items-center gap-4 w-100 mt-4">
        {entries.map((entry, i) => (
          <div key={i} className="chapter-section w-100">
            {entries.length > 1 && (
              <h5 className="fw-bold text-center mb-3 subject-title">
                {entry.subject}
              </h5>
            )}

            {entry.chapters.map((ch, j) => {
              const fullKey = `${entry.subject} ${ch.title}`;
              const percent = chapterProgress[`${moduleName}_${fullKey}`] || 0;

              return (
                <motion.div
                  key={j}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                >
                  <button
                    onClick={() => {
                      setSelectedChapter(fullKey);
                      navigate(
                        `/minigames/${moduleName}/${encodeURIComponent(
                          fullKey
                        )}`
                      );
                    }}
                    className="btn btn-lg shadow w-100 chapter-button"
                  >
                    <span className="chapter-title">{ch.title}</span>
                    <span className="chapter-percentage">{percent}%</span>
                  </button>
                </motion.div>
              );
            })}

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            >
              <button
                onClick={() => {
                  setSelectedChapter(t("chapters.allChapters"));
                  navigate(
                    `/minigames/${moduleName}/${encodeURIComponent(
                      t("chapters.allChapters")
                    )}`
                  );
                }}
                className="btn btn-lg shadow w-100 chapter-button"
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
