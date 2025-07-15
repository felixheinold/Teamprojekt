import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./MemoryRound2.css";

const shuffleArray = <T,>(array: T[]): T[] =>
  [...array].sort(() => Math.random() - 0.5);

type Card = {
  id: number;
  type: "term" | "definition";
  content: string;
  pairId: string;
};

const MemoryRound2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const soundEnabled = localStorage.getItem("soundEnabled") !== "false";
  const volume = Number(localStorage.getItem("volume") || "50") / 100;

  const {
    module = "",
    chapter = "",
    subject,
    pairs = [],
    timeLimit = 20,
    isAllChapters,
    chapterCount,
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
        pairId: p.id,
      });
      allCards.push({
        id: index * 2 + 1,
        type: "definition",
        content: p.definition,
        pairId: p.id,
      });
    });
    setCards(shuffleArray(allCards));
  }, [pairs]);

  useEffect(() => {
    correctSound.current = new Audio("/sounds/correct.mp3");
    wrongSound.current = new Audio("/sounds/wrong.mp3");

    [correctSound.current, wrongSound.current].forEach((audio) => {
      if (audio) audio.volume = volume;
    });
  }, [volume]);

  useEffect(() => {
    if (disabled || matched.length === cards.length) return;
    const t = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          resetFlipsFromTimeout();
          return timeLimit;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [disabled, flipped, timeLimit, cards.length, matched.length]);

  const handleCardClick = (card: Card) => {
    if (disabled || flipped.includes(card.id) || matched.includes(card.id))
      return;

    if (flipped.length === 0) {
      setFlipped([card.id]);
    } else if (flipped.length === 1) {
      const firstCard = cards.find((c) => c.id === flipped[0]);
      if (!firstCard) return;

      const newFlipped = [flipped[0], card.id];
      setFlipped(newFlipped);
      setDisabled(true);

      if (firstCard.pairId === card.pairId && firstCard.type !== card.type) {
        setFeedback("correct");

        const statsKey = "userStats";
        const gameKey = "memory";
        const stored = localStorage.getItem(statsKey);
        const allStats = stored ? JSON.parse(stored) : {};

        if (!allStats[gameKey]) allStats[gameKey] = {};
        if (!allStats[gameKey][module]) allStats[gameKey][module] = {};
        if (!allStats[gameKey][module][chapter])
          allStats[gameKey][module][chapter] = { correct: [] };

        if (!allStats[gameKey][module][chapter].correct.includes(card.pairId)) {
          allStats[gameKey][module][chapter].correct.push(card.pairId);
          localStorage.setItem(statsKey, JSON.stringify(allStats));
        }

        setTimeout(() => {
          setMatched((prev) => [...prev, ...newFlipped]);
          setFeedback(null);
          resetFlipsFromUser();
        }, 1000);
      } else {
        if (soundEnabled) wrongSound.current?.play();
        setFeedback("wrong");
        setTimeout(() => {
          setFeedback(null);
          resetFlipsFromUser();
        }, 3000);
      }
    }
  };

  const resetFlipsFromTimeout = () => {
    setFlipped([]);
    setTimer(timeLimit);
    setDisabled(false);
    setTurn((prev) => prev + 0.5);
  };

  const resetFlipsFromUser = () => {
    setFlipped([]);
    setTimer(timeLimit);
    setDisabled(false);
    setTurn((prev) => prev + 1);
  };

  const allMatched = matched.length === cards.length;

<<<<<<< HEAD
return (
=======
  return (
>>>>>>> gui
    <div className="memoryr2-wrapper">
      {/* Abbrechen-Button */}
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
                className="btn btn-secondary"
                onClick={() => setShowCancelConfirm(false)}
              >
                {t("common.no")}
              </button>
              <button className="btn btn-danger" onClick={() => navigate(-4)}>
                {t("common.yesBack")}
              </button>
            </div>
          </div>
        )}
      </div>
<<<<<<< HEAD
 
=======
>>>>>>> gui
      {/* Modul & Kapitelanzeige */}
      <div className="memory-header">{t(`modules.${module}`)}</div>
      <div className="memory-subheader">{chapter}</div>

      {/* Titel */}
      <h1 className="memoryr2-title"> {t("memoryround2.title")} </h1>

      {/* Statusleiste */}
      <div className="statusbar">
        <div>
          {matched.length / 2} / {cards.length / 2} {t("memoryround2.pairs")}
        </div>
        <div>
          {" "}
          {t("memoryround2.plays")} {turn - 1}
        </div>
        <div>⏳ {timer}s</div>
      </div>
<<<<<<< HEAD
 
=======
>>>>>>> gui
      {/* Spielfeld */}
      <div className="memory-grid">
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
        <div
          className="px-4 py-2 rounded-pill text-dark fw-semibold"
          style={{ backgroundColor: "#d3bfff" }}
        >
          {t("memoryround2.term")}
        </div>
        <div
          className="px-4 py-2 rounded-pill text-dark fw-semibold"
          style={{ backgroundColor: "#fff59d" }}
        >
          {t("memoryround2.definition")}
        </div>
      </div>
<<<<<<< HEAD
 
=======
>>>>>>> gui
      {/* Spiel beenden */}
      {allMatched && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            navigate("/memoryround2result", {
              state: {
                module,
                chapter,
                subject,
                questionCount: pairs.length,
                turns: turn - 1,
                pairs,
                isAllChapters,
                chapterCount,
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
          {t("memoryround2.next")}
        </motion.button>
      )}
    </div>
  );
};

export default MemoryRound2;
