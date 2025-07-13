import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "./MemoryRound1.css";

// Typdefinition für Begriffspaare
type MemoryPair = {
  id: string;
  term: string;
  definition: string;
};

const initialPairs: MemoryPair[] = [
  {
    id: "pb-k1-en-q1",
    term: "Liquidität",
    definition: "Fähigkeit, Zahlungsverpflichtungen fristgerecht nachzukommen.",
  },
  {
    id: "pb-k1-en-q2",
    term: "Investition",
    definition:
      "Verwendung finanzieller Mittel zur Beschaffung von Vermögensgegenständen.",
  },
  {
    id: "pb-k1-en-q3",
    term: "Abschreibung",
    definition: "Wertminderung von Anlagegütern durch Nutzung oder Zeitablauf.",
  },
  {
    id: "pb-k1-en-q4",
    term: "Bilanz",
    definition: "Gegenüberstellung von Aktiva und Passiva zu einem Stichtag.",
  },
  {
    id: "pb-k1-en-q5",
    term: "Eigenkapital",
    definition:
      "Finanzmittel, die dem Unternehmen von den Eigentümern zur Verfügung gestellt werden.",
  },
  {
    id: "pb-k1-en-q6",
    term: "Fremdkapital",
    definition:
      "Kapital, das von Dritten (z. B. Banken) zur Verfügung gestellt wird.",
  },
  {
    id: "pb-k1-en-q7",
    term: "Rendite",
    definition:
      "Ertrag einer Kapitalanlage im Verhältnis zum eingesetzten Kapital.",
  },
  {
    id: "pb-k1-en-q8",
    term: "Liquiditätsgrad",
    definition: "Kennzahl zur Beurteilung der kurzfristigen Zahlungsfähigkeit.",
  },
  {
    id: "pb-k1-en-q9",
    term: "Break-even-Point",
    definition: "Punkt, an dem Erlöse und Kosten gleich hoch sind.",
  },
  {
    id: "pb-k1-en-q10",
    term: "Kalkulation",
    definition:
      "Ermittlung der Kosten und Preise von Produkten oder Leistungen.",
  },
  {
    id: "pb-k1-en-q11",
    term: "Skonto",
    definition: "Preisnachlass bei Zahlung innerhalb einer bestimmten Frist.",
  },
  {
    id: "pb-k1-en-q12",
    term: "Deckungsbeitrag",
    definition: "Differenz zwischen Erlös und variablen Kosten.",
  },
  {
    id: "pb-k1-en-q13",
    term: "Fixkosten",
    definition: "Kosten, die unabhängig von der Produktionsmenge anfallen.",
  },
  {
    id: "pb-k1-en-q14",
    term: "Variable Kosten",
    definition: "Kosten, die sich mit der Produktionsmenge ändern.",
  },
  {
    id: "pb-k1-en-q15",
    term: "GuV",
    definition:
      "Gegenüberstellung von Aufwendungen und Erträgen in einer Abrechnungsperiode.",
  },
];

const shuffleArray = <T,>(arr: T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5);

const MemoryRound1 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
  const volume = Number(localStorage.getItem("volume") || "50") / 100;
  const {
    module = "",
    chapter = "",
    subject = "",
    questionCount = 6,
    timeLimit = 20,
  } = location.state || {};

  const [selectedPairs, setSelectedPairs] = useState<MemoryPair[]>([]);

  useEffect(() => {
    const fetchPairs = async () => {
      const subjectKey = subject?.toLowerCase();
      const match = chapter?.match(/Kapitel (\d+)/i);
      const chapterKey = match ? `k${match[1]}` : null;
      const langKey = i18n.language.startsWith("de") ? "de" : "en";

      if (!subjectKey || !chapterKey) {
        setSelectedPairs(shuffleArray(initialPairs).slice(0, questionCount));
        return;
      }

      const path = `/questions/memory/${subjectKey}_${chapterKey}_${langKey}.json`;
      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error("Datei nicht gefunden");
        const data = (await res.json()) as MemoryPair[];
        setSelectedPairs(shuffleArray(data).slice(0, questionCount));
      } catch (err) {
        console.warn("Fehler beim Laden – fallback zu initialPairs", err);
        setSelectedPairs(shuffleArray(initialPairs).slice(0, questionCount));
      }
    };

    fetchPairs();
  }, [module, chapter, questionCount]);

  useEffect(() => {
    const key = "progress";
    const stored = localStorage.getItem(key);
    const progress = stored ? JSON.parse(stored) : {};

    if (!progress.memoryTotal) progress.memoryTotal = {};
    if (!progress.memoryTotal[module]) progress.memoryTotal[module] = {};

    const allIds = selectedPairs.map((pair) => pair.id);
    progress.memoryTotal[module][chapter] = allIds;

    localStorage.setItem(key, JSON.stringify(progress));
  }, [module, chapter, selectedPairs]);

  const terms = useMemo(
    () =>
      shuffleArray(
        selectedPairs.map((pair) => ({ id: pair.id, text: pair.term }))
      ),
    [selectedPairs]
  );

  const definitions = useMemo(
    () =>
      shuffleArray(
        selectedPairs.map((pair) => ({ id: pair.id, text: pair.definition }))
      ),
    [selectedPairs]
  );
  const [assignments, setAssignments] = useState({});
  const [usedTerms, setUsedTerms] = useState(new Set());
  const [draggedTerm, setDraggedTerm] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // 🎵 Sound Refs
  const checkSound = useRef<HTMLAudioElement | null>(null);
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    checkSound.current = new Audio("/sounds/check.mp3");
    correctSound.current = new Audio("/sounds/correct.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");

    [checkSound.current, correctSound.current, wrongSound.current].forEach(
      (audio) => {
        if (audio) audio.volume = volume;
      }
    );
  }, [volume]);

  useEffect(() => {
    const startAssignments = {};
    definitions.forEach((def) => {
      startAssignments[def.id] = null;
    });
    setAssignments(startAssignments);
  }, [definitions]);

  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const handleTermClick = (id, isUsed) => {
    if (isUsed || submitted || !isTouchDevice()) return;
    setSelectedTerm(id === selectedTerm ? null : id);
  };

  const handleDrop = (defId) => {
    if ((!draggedTerm && !selectedTerm) || submitted) return;
    const termToAssign = isTouchDevice() ? selectedTerm : draggedTerm;
    if (!termToAssign || usedTerms.has(termToAssign)) return;

    setAssignments((prev) => {
      const prevTerm = prev[defId];
      const updatedAssignments = { ...prev, [defId]: termToAssign };

      setUsedTerms((prevUsed) => {
        const updated = new Set(prevUsed);
        if (prevTerm) updated.delete(prevTerm);
        updated.add(termToAssign);
        return updated;
      });

      return updatedAssignments;
    });

    if (isTouchDevice()) setSelectedTerm(null);
    else setDraggedTerm(null);
  };

  const checkCorrect = (defId, termId) => defId === termId;

  const handleResetTerm = (defId) => {
    if (submitted) return;
    const prevTerm = assignments[defId];
    if (prevTerm) {
      setAssignments((prev) => ({ ...prev, [defId]: null }));
      setUsedTerms((prev) => {
        const copy = new Set(prev);
        copy.delete(prevTerm);
        return copy;
      });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (soundEnabled) checkSound.current?.play();

    const hasError = Object.entries(assignments).some(
      ([def, term]) => !checkCorrect(def, term)
    );

    setTimeout(() => {
      if (hasError) {
        if (soundEnabled) wrongSound.current?.play();
      } else {
        if (soundEnabled) correctSound.current?.play();
      }
    }, 500);
  };

  const handleFinish = () => {
    const correctCount = Object.entries(assignments).filter(([defId, termId]) =>
      checkCorrect(defId, termId)
    ).length;

    navigate("/memoryround1result", {
      state: {
        correctCount,
        total: definitions.length,
        module,
        chapter,
        timeLimit,
        pairs: selectedPairs,
      },
    });
  };

  return (
    <div className="memory-wrapper">
      {/* Cancel Button */}
      <div className="cancel-button">
        {!showCancelConfirm ? (
          <button
            className="btn btn-dark"
            onClick={() => setShowCancelConfirm(true)}
          >
            {t("common.cancel")}
          </button>
        ) : (
          <div className="cancel-confirm-container">
            <div className="cancel-confirm-text">
              {t("common.confirmCancel")}
            </div>
            <div className="cancel-confirm-buttons">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCancelConfirm(false)}
              >
                {t("common.no")}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => navigate(-2)}
              >
                {t("common.yesBack")}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="memory-header">{t(`modules.${module}`)}</div>
      <div className="memory-subheader">{chapter}</div>
      <h1 className="memoryr1-title"> {t("memoryround1.title")} </h1>

      {/* Paare */}
      <div
        className="d-flex justify-content-between"
        style={{ width: "100%", maxWidth: "1000px", gap: "20px" }}
      >
        <div className="flex-grow-1 px-2">
          <h5 className="text-center fw-bold mb-3">
            {t("memoryround1.terms")}
          </h5>
          {terms.map((item, i) => {
            const isUsed = usedTerms.has(item.id);
            const isSelected = item.id === selectedTerm;
            return (
              <motion.div
                key={i}
                draggable={!isUsed && !submitted && !isTouchDevice()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTermClick(item.id, isUsed)}
                onDragStart={() => setDraggedTerm(item.id)}
                className="mb-3 text-center p-3 shadow-sm term-box"
                style={{
                  backgroundColor: isUsed
                    ? "#d9d4e7"
                    : isSelected
                    ? "#e6dcf9"
                    : "#d3bfff",
                  borderRadius: "10px",
                  cursor:
                    isUsed || submitted
                      ? "not-allowed"
                      : isTouchDevice()
                      ? "pointer"
                      : "grab",
                  opacity: isUsed ? 0.5 : 1,
                  height: "60px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: isSelected ? "2px solid #7f56d9" : "none",
                }}
              >
                {item.text}
              </motion.div>
            );
          })}
        </div>

        <div className="flex-grow-1 px-2">
          <h5 className="text-center fw-bold mb-3">
            {t("memoryround1.definitions")}
          </h5>
          {definitions.map((item, i) => {
            const assignedTerm = assignments[item.id];
            const isCorrect = submitted && checkCorrect(item.id, assignedTerm);
            const isIncorrect = submitted && assignedTerm && !isCorrect;
            const bgColor = isCorrect
              ? "#198754"
              : isIncorrect
              ? "#dc3545"
              : "#fff59d";

            return (
              <div
                key={i}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(item.id)}
                onTouchEnd={() => handleDrop(item.id)}
                className="mb-3 d-flex align-items-center justify-content-between p-3 definition-box"
                style={{
                  backgroundColor: bgColor,
                  borderRadius: "10px",
                  height: "60px",
                  fontWeight: "500",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <span style={{ flex: 1 }}>{item.text}</span>
                {assignedTerm && (
                  <motion.span
                    className="badge bg-secondary ms-3 memory-badge"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetTerm(item.id);
                    }}
                  >
                    {terms.find((t) => t.id === assignedTerm)?.text || ""}
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={submitted ? handleFinish : handleSubmit}
        className="fw-bold text-white mt-4"
        style={{
          backgroundColor: "#9a7fc6",
          border: "none",
          borderRadius: "12px",
          padding: "10px 20px",
          fontSize: "1.2rem",
        }}
      >
        {submitted ? t("memoryround1.next") : t("memoryround1.check")}
      </motion.button>
    </div>
  );
};

export default MemoryRound1;
