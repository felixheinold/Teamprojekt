import { useAppFlow } from "../../context/AppFlowContext";

const Minigames = () => {
  const { selectedModule, selectedChapter } = useAppFlow();

  return (
    <div className="container py-4 d-flex flex-column align-items-center">
      {/* Modul-Anzeige */}
      <div className="w-100 d-flex justify-content-center mb-3">
        <div
          className="btn btn-success btn-lg rounded-pill text-center"
          style={{ maxWidth: "600px", width: "100%" }}
        >
          {selectedModule}
        </div>
      </div>

      {/* Kapitel-Anzeige */}
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
          {selectedChapter}
        </div>
      </div>

      {/* Überschrift */}
      <h2 className="fw-bold text-center mb-4">Wähle ein Mini-Game aus</h2>

      {/* Game-Buttons */}
      <div className="d-flex flex-wrap justify-content-center gap-4">
        {/* Quiz */}
        <div className="text-center">
          <div
            className="rounded shadow"
            style={{
              backgroundColor: "#d3bfff",
              width: "120px",
              height: "120px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <img
              src="/images/quiz.png"
              alt="Quiz"
              style={{ width: "60px", height: "60px" }}
            />
          </div>
          <div className="fw-semibold">Quiz</div>
        </div>

        {/* Memory */}
        <div className="text-center">
          <div
            className="rounded shadow"
            style={{
              backgroundColor: "#b6efe1",
              width: "120px",
              height: "120px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <img
              src="/images/memory.png"
              alt="Memory"
              style={{ width: "60px", height: "60px" }}
            />
          </div>
          <div className="fw-semibold">Memory</div>
        </div>

        {/* Lückentext */}
        <div className="text-center">
          <div
            className="rounded shadow"
            style={{
              backgroundColor: "#a4c4f4",
              width: "120px",
              height: "120px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <img
              src="/images/fillgap.png"
              alt="Lückentext"
              style={{ width: "60px", height: "60px" }}
            />
          </div>
          <div className="fw-semibold">Lückentext</div>
        </div>
      </div>
    </div>
  );
};

export default Minigames;
