import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Card = {
  id: number;
  type: "term" | "definition";
  content: string;
  pairId: number;
};

const shuffleArray = <T,>(array: T[]): T[] =>
  [...array].sort(() => Math.random() - 0.5);

const MemoryRound2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const {
    module = "",
    chapter = "",
    pairs = [],
    timeLimit = 20,
  } = location.state || {};

  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [timer, setTimer] = useState(timeLimit);
  const [turn, setTurn] = useState(1);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const correctSound = useRef<HTMLAudioElement | null>(null);
  const wrongSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const allCards: Card[] = [];
    pairs.forEach((p: any, index: number) => {
      allCards.push({
        id: index * 2,
        type: "term",
        content: p.term,
        pairId: index,
      });
      allCards.push({
        id: index * 2 + 1,
        type: "definition",
        content: p.definition,
        pairId: index,
      });
    });
    setCards(shuffleArray(allCards));
  }, [pairs]);

  useEffect(() => {
    correctSound.current = new Audio("/sounds/correct.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");
  }, []);

  useEffect(() => {
    if (disabled || matched.length === cards.length) return;
    const t = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          resetFlips();
          return timeLimit;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [disabled, flipped, cards.length, matched.length, timeLimit]);

  const handleCardClick = (card: Card) => {
    if (disabled || flipped.includes(card.id) || matched.includes(card.id)) return;

    if (flipped.length === 0) {
      setFlipped([card.id]);
    } else if (flipped.length === 1) {
      const firstCard = cards.find((c) => c.id === flipped[0]);
      if (!firstCard) return;

      const newFlipped = [flipped[0], card.id];
      setFlipped(newFlipped);
      setDisabled(true);

      const isMatch = firstCard.pairId === card.pairId && firstCard.type !== card.type;

      if (isMatch) {
        correctSound.current?.play();
        setFeedback("correct");
        setTimeout(() => {
          setMatched((prev) => [...prev, ...newFlipped]);
          setFeedback(null);
          resetFlips();
        }, 1000);
      } else {
        wrongSound.current?.play();
        setFeedback("wrong");
        setTimeout(() => {
          setFeedback(null);
          resetFlips();
        }, 3000);
      }
    }
  };

  const resetFlips = () => {
    setFlipped([]);
    setTimer(timeLimit);
    setDisabled(false);
    setTurn((prev) => prev + 1);
  };

  const allMatched = matched.length === cards.length;

  return (
    <div
      className="container d-flex flex-column align-items-center pt-2"
      style={{ minHeight: "100vh" }}
    >
      {/* Abbrechen */}
      <div
        className="position-absolute"
        style={{ top: "80px", left: "30px", zIndex: 10 }}
      >
        {!showCancelConfirm ? (
          <button className="btn btn-dark" onClick={() => setShowCancelConfirm(true)}>
            Abbrechen
          </button>
        ) : (
          <div className="cancel-confirm-container">
            <div className="cancel-confirm-text">
              Möchtest du wirklich abbrechen?
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowCancelConfirm(false)}>
                Nein
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => navigate(-4)}>
                Ja, zurück
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
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

      <h1 className="fw-bold display-5 mb-3">🧠 Memory Runde 2</h1>

      {/* Status */}
      <div className="d-flex justify-content-between mb-3" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="fw-semibold">
          {matched.length / 2} / {cards.length / 2} Paare
        </div>
        <div>Züge: {turn - 1}</div>
        <div>⏳ {timer}s</div>
      </div>

      {/* Karten */}
      <div
        className="d-flex flex-wrap justify-content-center mb-4"
        style={{ maxWidth: "1000px", gap: "12px" }}
      >
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.id);
          const baseColor = card.type === "term" ? "#d3bfff" : "#fff59d";
          const showContent = isFlipped || isMatched;

          const feedbackColor =
            isFlipped && flipped.length === 2 && feedback === "correct"
              ? "#28a745"
              : isFlipped && flipped.length === 2 && feedback === "wrong"
              ? "#dc3545"
              : baseColor;

          return (
            <motion.div
              key={card.id}
              className={`memory-card d-flex align-items-center justify-content-center text-center shadow-sm ${
                card.type === "term" ? "card-term" : "card-definition"
              }`}
              onClick={() => handleCardClick(card)}
              style={{
                backgroundColor: showContent ? feedbackColor : baseColor,
                cursor: showContent || disabled ? "default" : "pointer",
                opacity: isMatched ? 0 : 1,
              }}
              whileHover={{ scale: !isFlipped && !isMatched ? 1.03 : 1 }}
              whileTap={{ scale: !isFlipped && !isMatched ? 0.97 : 1 }}
            >
              {showContent ? card.content : ""}
            </motion.div>
          );
        })}
      </div>

      {/* Legende */}
      <div className="d-flex gap-3 mt-2">
        <div className="px-4 py-2 rounded-pill text-dark fw-semibold" style={{ backgroundColor: "#d3bfff" }}>
          = Begriff
        </div>
        <div className="px-4 py-2 rounded-pill text-dark fw-semibold" style={{ backgroundColor: "#fff59d" }}>
          = Definition
        </div>
      </div>

      {/* Beenden */}
      {allMatched && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            navigate("/memoryround2result", {
              state: {
                module,
                chapter,
                questionCount: pairs.length,
                turns: turn - 1,
                pairs,
              },
            })
          }
          className="fw-bold text-white mt-4"
          style={{
            backgroundColor: "#9a7fc6",
            border: "none",
            borderRadius: "12px",
            padding: "10px 20px",
            fontSize: "1.2rem",
          }}
        >
          Minispiel beenden
        </motion.button>
      )}
    </div>
  );
};

export default MemoryRound2;
