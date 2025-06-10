import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MemoryRound1Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    correctCount = 0,
    total = 1,
    module,
    chapter,
    timeLimit = 20,
    pairs = [],
  } = location.state || {};

  const percentage = Math.round((correctCount / total) * 100);
  const passed = percentage >= 66;

  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: "100vh", paddingTop: "80px", paddingBottom: "40px" }}
    >
      <h1 className="fw-bold display-5 mb-3">
        {passed
          ? "🎉 Gut gemacht! Du bist für die nächste Runde vorbereitet"
          : "🔁 Das solltest du besser nochmal üben..."}
      </h1>
      <p className="fs-4 mb-4">
        Du hast <strong>{percentage}%</strong> ({correctCount} von {total})
        richtig zugeordnet.
      </p>

      {passed ? (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn fw-bold text-white mb-3"
            style={{
              backgroundColor: "#9a7fc6",
              fontSize: "1.4rem",
              borderRadius: "14px",
              padding: "14px 28px",
            }}
            onClick={() =>
              navigate("/memoryround2", {
                state: { module, chapter, pairs, timeLimit },
              })
            }
          >
            ➡️ Weiter zu Runde 2
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn fw-bold text-white"
            style={{
              backgroundColor: "#d3bfff",
              fontSize: "1.2rem",
              borderRadius: "12px",
            }}
            onClick={() =>
              navigate("/memoryround1", {
                state: {
                  module,
                  chapter,
                  questionCount: pairs.length,
                  timeLimit,
                  pairs,
                },
              })
            }
          >
            🔁 Runde 1 erneut spielen
          </motion.button>
        </>
      ) : (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn fw-bold text-white mb-3"
            style={{
              backgroundColor: "#9a7fc6",
              fontSize: "1.3rem",
              borderRadius: "14px",
              padding: "14px 28px",
            }}
            onClick={() =>
              navigate("/memoryround1", {
                state: {
                  module,
                  chapter,
                  questionCount: pairs.length,
                  pairs,
                  timeLimit,
                },
              })
            }
          >
            🔁 Versuche es nochmal
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn fw-bold text-white"
            style={{
              backgroundColor: "#d3bfff",
              fontSize: "1.2rem",
              borderRadius: "12px",
            }}
            onClick={() =>
              navigate("/memoryround2", {
                state: { module, chapter, pairs, timeLimit },
              })
            }
          >
            ➡️ Trotzdem weiter zu Runde 2
          </motion.button>
        </>
      )}
    </div>
  );
};

export default MemoryRound1Result;
