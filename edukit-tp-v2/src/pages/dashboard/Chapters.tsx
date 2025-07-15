import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppFlow } from "../../context/AppFlowContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Chapters.css";

const generateLocalizedChapters = (
  module: string,
  subjectKey: string,
  chapterCount: number,
  t: any
) =>
  Array.from({ length: chapterCount }, (_, i) => ({
    title: t(`chapters.${module}.${subjectKey}.k${i + 1}`),
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
    brand: "🏷️",
  };

  const moduleStructure: Record<
    string,
    { subjectKey: string; subject: string; chapterCount: number }[]
  > = {
    production: [
      {
        subjectKey: "production",
        subject: t("subjects.production"),
        chapterCount: 3,
      },
      {
        subjectKey: "logistics",
        subject: t("subjects.logistics"),
        chapterCount: 3,
      },
      { subjectKey: "energy", subject: t("subjects.energy"), chapterCount: 3 },
      {
        subjectKey: "informatics",
        subject: t("subjects.informatics"),
        chapterCount: 9,
      },
    ],
    finance: [
      {
        subjectKey: "finance",
        subject: t("subjects.finance"),
        chapterCount: 5,
      },
      {
        subjectKey: "accounting",
        subject: t("subjects.accounting"),
        chapterCount: 6,
      },
      {
        subjectKey: "balance",
        subject: t("subjects.balance"),
        chapterCount: 6,
      },
    ],
    management: [
      {
        subjectKey: "management",
        subject: t("subjects.management"),
        chapterCount: 4,
      },
      {
        subjectKey: "marketing",
        subject: t("subjects.marketing"),
        chapterCount: 8,
      },
    ],
    planning: [
      {
        subjectKey: "planning",
        subject: t("subjects.planning"),
        chapterCount: 12,
      },
    ],
    brand: [
      { subjectKey: "brand", subject: t("subjects.brand"), chapterCount: 5 },
    ],
  };

  const moduleData = (moduleStructure[moduleName] || []).map((entry) => ({
    subject: entry.subject,
    subjectKey: entry.subjectKey,
    chapters: generateLocalizedChapters(
      moduleName,
      entry.subjectKey,
      entry.chapterCount,
      t
    ),
  }));

  const entries = moduleData;

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
                        )}`,
                        { state: { subjectKey: entry.subjectKey } }
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
                    )}`,
                    {
                      state: {
                        subjectKey: entry.subjectKey,
                        chapterCount: entry.chapters.length,
                        isAllChapters: true,
                      },
                    }
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
