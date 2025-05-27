import { useParams, Link } from "react-router-dom";

const Chapters = () => {
  const { id } = useParams();

  return (
    <div className="container py-5">
      <h2 className="mb-4">Kapitel für Fach {id}</h2>
      {[1, 2, 3].map((num) => (
        <div key={num} className="mb-3">
          <Link to={`/minigames/${id}/${num}`} className="btn btn-outline-success w-100">
            Kapitel {num}
          </Link>
        </div>
      ))}
      <Link to="/modules" className="btn btn-secondary mt-3">Zurück</Link>
    </div>
  );
};

export default Chapters;
