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
];

const shuffleArray = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

const MemoryGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    module = "",
    chapter = "",
    questionCount = 6,
    timeLimit = 20,
  } = location.state || {};

  const [terms, setTerms] = useState(() => shuffleArray(initialPairs));
  const [definitions, setDefinitions] = useState(() =>
    shuffleArray(initialPairs)
  );
  const [assignments, setAssignments] = useState<{
    [key: string]: string | null;
  }>({});
  const [usedTerms, setUsedTerms] = useState<Set<string>>(new Set());
  const [draggedTerm, setDraggedTerm] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const startAssignments: { [key: string]: string | null } = {};
    initialPairs.forEach((pair) => {
      startAssignments[pair.definition] = null;
    });
    setAssignments(startAssignments);
  }, []);

  const handleDrop = (def: string) => {
    if (!draggedTerm || submitted) return;

    if (usedTerms.has(draggedTerm)) return;

    setAssignments((prev) => {
      const prevTerm = prev[def];
      const updatedAssignments = { ...prev, [def]: draggedTerm };

      setUsedTerms((prevUsed) => {
        const updated = new Set(prevUsed);
        if (prevTerm) updated.delete(prevTerm);
        updated.add(draggedTerm);
        return updated;
      });

      return updatedAssignments;
    });

    setDraggedTerm(null);
  };

  const checkCorrect = (def: string, term: string | null) => {
    const pair = initialPairs.find((p) => p.definition === def);
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
      },
    });
  };

  return (
    <div
      className="container d-flex flex-column align-items-center pt-2"
      style={{ minHeight: "100vh" }}
    >
      {/* Abbrechen-Button */}
      <button
        className="btn btn-dark position-absolute"
        style={{ top: "80px", left: "30px", zIndex: 10 }}
        onClick={() => navigate(-2)}
      >
        Abbrechen
      </button>

      {/* Modul-Kästchen */}
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

      {/* Kapitel-Kästchen */}
      <div
        className="mb-4 px-4 py-2 rounded text-dark fw-semibold text-center"
        style={{
          backgroundColor: "#78ba84",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        {chapter}
      </div>

      {/* Überschrift */}
      <h1 className="fw-bold display-5 mb-4">🧠 Memory Runde 1</h1>

      {/* Begriffe und Definitionen */}
      <div
        className="d-flex flex-wrap justify-content-center w-100"
        style={{ maxWidth: 900 }}
      >
        {/* Begriffe */}
        <div className="flex-grow-1 px-2">
          <h5 className="text-center fw-bold mb-3">Begriffe</h5>
          {terms.map((item, i) => {
            const isUsed = usedTerms.has(item.term);
            return (
              <motion.div
                key={i}
                draggable={!isUsed && !submitted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onDragStart={() => setDraggedTerm(item.term)}
                className="mb-3 text-center p-3 shadow-sm"
                style={{
                  backgroundColor: isUsed ? "#b5a4d6" : "#d3bfff",
                  borderRadius: "10px",
                  cursor: isUsed || submitted ? "not-allowed" : "grab",
                  opacity: isUsed ? 0.5 : 1,
                  height: "60px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.term}
              </motion.div>
            );
          })}
        </div>

        {/* Definitionen */}
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
                className="mb-3 d-flex align-items-center justify-content-between p-3"
                style={{
                  backgroundColor: bgColor,
                  borderRadius: "10px",
                  height: "60px",
                  fontWeight: "500",
                  position: "relative",
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
                    onClick={() => handleResetTerm(item.definition)}
                  >
                    {assignedTerm}
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={submitted ? handleFinish : handleSubmit}
        className="fw-bold text-white mt-4"
        style={{
          backgroundColor: "#9b59b6",
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

export default MemoryGame;
