import { useAppFlow } from "../../context/AppFlowContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Minigames = () => {
  const { selectedModule, selectedChapter } = useAppFlow();
  const navigate = useNavigate();

  const fullInfo = selectedChapter?.trim() || "";
  const hasMultiSubjects =
    fullInfo.length > 0 && !fullInfo.includes(selectedModule);

  const secondLine = hasMultiSubjects
    ? fullInfo
    : fullInfo.replace(`${selectedModule} `, "");

  const handleClick = (route: string) => {
    navigate(route, {
      state: {
        module: selectedModule,
        subject: hasMultiSubjects
          ? fullInfo.split(" Kapitel")[0]
          : selectedModule,
        chapter: fullInfo,
      },
    });
  };

  return (
    <div className="container py-4 d-flex flex-column align-items-center">
      {/* Modul */}
      <div className="w-100 d-flex justify-content-center mb-3">
        <div
          className="btn btn-success btn-lg rounded-pill text-center"
          style={{ maxWidth: "600px", width: "100%" }}
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

      {/* Game-Karten mit Animation & größerer Breite */}
      <div className="d-flex flex-wrap justify-content-center gap-4">
        {[
          {
            name: "Quiz",
            color: "#d3bfff",
            icon: "/images/quiz.png",
            route: "/quiz",
          },
          {
            name: "Memory",
            color: "#b6efe1",
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
            onClick={() => handleClick(game.route)}
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
    </div>
  );
};

export default Minigames;
