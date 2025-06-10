import { useAppFlow } from "../../context/AppFlowContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Minigames = () => {
  const { selectedModule, selectedChapter } = useAppFlow();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<null | {
    name: string;
    route: string;
  }>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15);

  const fullInfo = selectedChapter?.trim() || "";
  const hasMultiSubjects =
    fullInfo.length > 0 && !fullInfo.includes(selectedModule);

  const secondLine = hasMultiSubjects
    ? fullInfo
    : fullInfo.replace(`${selectedModule} `, "");

  const handleGameClick = (game: { name: string; route: string }) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const handleStart = () => {
    if (!selectedGame) return;
    navigate(selectedGame.route, {
      state: {
        module: selectedModule,
        subject: hasMultiSubjects
          ? fullInfo.split(" Kapitel")[0]
          : selectedModule,
        chapter: fullInfo,
        questionCount,
        timeLimit,
      },
    });
  };

  const timeOptions = [5, 10, 15, 20, 30, 40, 50, 60];

  return (
    <div className="container py-4 d-flex flex-column align-items-center">
      {/* Modul */}
      <div className="w-100 d-flex justify-content-center mb-3">
        <div
          className="btn btn-success btn-lg rounded-pill text-center"
          style={{ maxWidth: "600px", width: "100%", marginTop: "12px" }}
        >
          {selectedModule}
        </div>
      </div>

      {/* Kapitel oder Fach+Kapitel */}
      <div className="w-100 d-flex justify-content-center mb-4">
        <div
          className="btn btn-lg text-center"
          style={{
            maxWidth: "600px",
            width: "100%",
            backgroundColor: "#78ba84",
            fontWeight: "500",
            border: "none",
          }}
        >
          {secondLine}
        </div>
      </div>

      {/* Überschrift */}
      <h1 className="fw-bold text-center display-5 mb-4">
        🎮 Wähle ein Mini-Game aus
      </h1>

      {/* Game-Karten */}
      <div className="d-flex flex-wrap justify-content-center gap-4">
        {[
          {
            name: "Quiz",
            color: "#b6efe1",
            icon: "/images/quiz.png",
            route: "/quiz",
          },
          {
            name: "Memory",
            color: "#d3bfff",
            icon: "/images/memory.png",
            route: "/memory",
          },
          {
            name: "Lückentext",
            color: "#a4c4f4",
            icon: "/images/fillgap.png",
            route: "/gapfill",
          },
        ].map((game, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            onClick={() => handleGameClick(game)}
            className="text-center rounded shadow"
            style={{
              backgroundColor: game.color,
              width: "220px",
              height: "200px",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <img
              src={game.icon}
              alt={game.name}
              style={{ width: "120px", height: "120px", marginBottom: "1rem" }}
            />
            <div className="fw-semibold fs-5">{game.name}</div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="d-flex rounded shadow-lg"
            style={{
              backgroundColor: "#fff",
              minWidth: "380px",
              overflow: "hidden",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
          >
            {/* Seitenleiste im Farbverlauf */}
            <div
              style={{
                background: "linear-gradient(180deg, #4a8f5c, #78ba84)",
                width: "12px",
              }}
            ></div>

            {/* Inhalt */}
            <div className="p-4 flex-grow-1">
              <h5 className="fw-bold text-success mb-3 text-center">
                Mini-Game starten
              </h5>

              {/* Fragenanzahl */}
              {/* Fragenanzahl oder Paare */}
              <div className="position-relative mb-3">
                <label className="form-label mb-1">
                  {selectedGame?.name === "Memory" ? "Paare:" : "Fragen:"}
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    appearance: "none",
                    backgroundColor: "#fff",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23666' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 10px center",
                    backgroundSize: "12px",
                    zIndex: 1000,
                  }}
                >
                  {selectedGame?.name === "Memory"
                    ? Array.from({ length: 11 }, (_, i) => i + 5).map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))
                    : Array.from({ length: 10 }, (_, i) => (i + 1) * 2).map(
                        (val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        )
                      )}
                </select>
              </div>

              {/* Zeitlimit */}
              <label className="form-label mb-1">Zeitlimit pro Frage:</label>
              <div className="position-relative mb-4">
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    appearance: "none",
                    backgroundColor: "#fff",
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23666' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 10px center",
                    backgroundSize: "12px",
                  }}
                >
                  {[...Array(4).keys()]
                    .map((i) => 5 + i * 5)
                    .map((val) => (
                      <option key={val} value={val}>
                        {val} Sekunden
                      </option>
                    ))}
                  {[...Array(4).keys()]
                    .map((i) => 30 + i * 10)
                    .map((val) => (
                      <option key={val} value={val}>
                        {val} Sekunden
                      </option>
                    ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-between mt-3">
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Zurück
                </button>
                <button
                  onClick={handleStart}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#4a8f5c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Minigames;
