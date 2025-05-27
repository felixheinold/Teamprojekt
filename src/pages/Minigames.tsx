import { useParams } from "react-router-dom";

const Minigames = () => {
  const { id, chapter } = useParams();

  return (
    <div className="container py-5">
      <h2 className="mb-4">Minispiele – Fach {id}, Kapitel {chapter}</h2>
      <div className="row g-3">
        {["Quiz", "Lückentext", "Memory", "Freitext"].map((game, i) => (
          <div key={i} className="col-md-3">
            <button className="btn btn-outline-info w-100">{game}</button>
          </div>
        ))}
      </div>
      <button className="btn btn-secondary mt-4">Zurück</button>
    </div>
  );
};

export default Minigames;


