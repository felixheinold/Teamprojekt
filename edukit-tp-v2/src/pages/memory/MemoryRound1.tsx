import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const initialPairs = [
  {
    term: "Liquidität",
    definition: "Fähigkeit, Zahlungsverpflichtungen fristgerecht nachzukommen.",
  },
  {
    term: "Investition",
    definition:
      "Verwendung finanzieller Mittel zur Beschaffung von Vermögensgegenständen.",
  },
  {
    term: "Abschreibung",
    definition: "Wertminderung von Anlagegütern durch Nutzung oder Zeitablauf.",
  },
  {
    term: "Bilanz",
    definition: "Gegenüberstellung von Aktiva und Passiva zu einem Stichtag.",
  },
  {
    term: "Eigenkapital",
    definition:
      "Finanzmittel, die dem Unternehmen von den Eigentümern zur Verfügung gestellt werden.",
  },
  {
    term: "Fremdkapital",
    definition:
      "Kapital, das von Dritten (z. B. Banken) zur Verfügung gestellt wird.",
  },
  {
    term: "Rendite",
    definition:
      "Ertrag einer Kapitalanlage im Verhältnis zum eingesetzten Kapital.",
  },
  {
    term: "Liquiditätsgrad",
    definition: "Kennzahl zur Beurteilung der kurzfristigen Zahlungsfähigkeit.",
  },
  {
    term: "Break-even-Point",
    definition: "Punkt, an dem Erlöse und Kosten gleich hoch sind.",
  },
  {
    term: "Kalkulation",
    definition:
      "Ermittlung der Kosten und Preise von Produkten oder Leistungen.",
  },
  {
    term: "Skonto",
    definition: "Preisnachlass bei Zahlung innerhalb einer bestimmten Frist.",
  },
  {
    term: "Deckungsbeitrag",
    definition: "Differenz zwischen Erlös und variablen Kosten.",
  },
  {
    term: "Fixkosten",
    definition: "Kosten, die unabhängig von der Produktionsmenge anfallen.",
  },
  {
    term: "Variable Kosten",
    definition: "Kosten, die sich mit der Produktionsmenge ändern.",
  },
  {
    term: "GuV",
    definition:
      "Gegenüberstellung von Aufwendungen und Erträgen in einer Abrechnungsperiode.",
  },
];

const shuffleArray = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

const MemoryRound1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    module = "",
    chapter = "",
    questionCount = 6,
    timeLimit = 20,
    pairs = null,
  } = location.state || {};

  const [selectedPairs] = useState(() =>
    pairs && Array.isArray(pairs)
      ? pairs
      : shuffleArray(initialPairs).slice(0, questionCount)
  );

  const [terms] = useState(() => shuffleArray(selectedPairs));
  const [definitions] = useState(() => shuffleArray(selectedPairs));
  const [assignments, setAssignments] = useState<{
    [key: string]: string | null;
  }>({});
  const [usedTerms, setUsedTerms] = useState<Set<string>>(new Set());
  const [draggedTerm, setDraggedTerm] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const startAssignments: { [key: string]: string | null } = {};
    selectedPairs.forEach((pair) => {
      startAssignments[pair.definition] = null;
    });
    setAssignments(startAssignments);
  }, [selectedPairs]);

  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };

  const handleTermClick = (term: string, isUsed: boolean) => {
    if (isUsed || submitted || !isTouchDevice()) return;
    setSelectedTerm(term === selectedTerm ? null : term);
  };

  const handleDrop = (def: string) => {
    if ((!draggedTerm && !selectedTerm) || submitted) return;

    const termToAssign = isTouchDevice() ? selectedTerm : draggedTerm;
    if (!termToAssign || usedTerms.has(termToAssign)) return;

    setAssignments((prev) => {
      const prevTerm = prev[def];
      const updatedAssignments = { ...prev, [def]: termToAssign };

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

  const checkCorrect = (def: string, term: string | null) => {
    const pair = selectedPairs.find((p) => p.definition === def);
    return pair && pair.term === term;
  };

  const handleResetTerm = (def: string) => {
    if (submitted) return;
    const prevTerm = assignments[def];
    if (prevTerm) {
      setAssignments((prev) => ({ ...prev, [def]: null }));
      setUsedTerms((prev) => {
        const copy = new Set(prev);
        copy.delete(prevTerm);
        return copy;
      });
    }
  };

  const handleSubmit = () => setSubmitted(true);

  const handleFinish = () => {
    const correctCount = Object.entries(assignments).filter(([def, term]) =>
      checkCorrect(def, term)
    ).length;

    navigate("/memoryround1result", {
      state: {
        correctCount,
        total: Object.keys(assignments).length,
        module,
        chapter,
        timeLimit,
        pairs: selectedPairs,
      },
    });
  };

  return (
    <div
      className="container d-flex flex-column align-items-center pt-2"
      style={{ minHeight: "100vh" }}
    >
      <button
        className="btn btn-dark position-absolute"
        style={{ top: "80px", left: "30px", zIndex: 10 }}
        onClick={() => navigate(-2)}
      >
        Abbrechen
      </button>

      <div
        className="mb-2 px-4 py-2 rounded-pill text-white fw-bold text-center"
        style={{
          backgroundColor: "#228b57",
          maxWidth: "600px",
          width: "100%",
          marginTop: "-8px",
        }}
      >
        {module}
      </div>
      <div
        className="mb-4 px-4 py-2 rounded text-dark fw-semibold text-center"
        style={{ backgroundColor: "#78ba84", maxWidth: "600px", width: "100%" }}
      >
        {chapter}
      </div>
      <h1 className="fw-bold display-5 mb-4">🧠 Memory Runde 1</h1>

      <div
        className="d-flex justify-content-between"
        style={{
          width: "100%",
          maxWidth: "1000px",
          gap: "20px",
          flexWrap: "nowrap",
        }}
      >
        <div className="flex-grow-1 px-2">
          <h5 className="text-center fw-bold mb-3">Begriffe</h5>
          {terms.map((item, i) => {
            const isUsed = usedTerms.has(item.term);
            const isSelected = item.term === selectedTerm;
            return (
              <motion.div
                key={i}
                draggable={!isUsed && !submitted && !isTouchDevice()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTermClick(item.term, isUsed)}
                onDragStart={() => setDraggedTerm(item.term)}
                className="mb-3 text-center p-3 shadow-sm"
                style={{
                  backgroundColor: isUsed
                    ? "#b5a4d6"
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
                {item.term}
              </motion.div>
            );
          })}
        </div>

        <div className="flex-grow-1 px-2">
          <h5 className="text-center fw-bold mb-3">Definitionen</h5>
          {definitions.map((item, i) => {
            const assignedTerm = assignments[item.definition];
            const isCorrect =
              submitted && checkCorrect(item.definition, assignedTerm);
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
                onDrop={() => handleDrop(item.definition)}
                onTouchEnd={() => handleDrop(item.definition)}
                className="mb-3 d-flex align-items-center justify-content-between p-3"
                style={{
                  backgroundColor: bgColor,
                  borderRadius: "10px",
                  height: "60px",
                  fontWeight: "500",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <span style={{ flex: 1 }}>{item.definition}</span>
                {assignedTerm && (
                  <motion.span
                    className="badge bg-secondary ms-3"
                    style={{
                      minWidth: "100px",
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetTerm(item.definition);
                    }}
                  >
                    {assignedTerm}
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
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
        {submitted ? "Runde 1 beenden" : "Überprüfe Antworten"}
      </motion.button>
    </div>
  );
};

export default MemoryRound1;
