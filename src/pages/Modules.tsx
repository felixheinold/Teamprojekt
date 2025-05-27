import { Link } from "react-router-dom";

const Modules = () => (
  <div className="container py-5">
    <h2 className="text-center mb-4">Module wählen</h2>
    <div className="row">
      {[1, 2, 3].map((num) => (
        <div key={num} className="col-md-4 mb-3">
          <Link to={`/chapters/${num}`} className="btn btn-outline-primary w-100">
            Fach {num}
          </Link>
        </div>
      ))}
    </div>
    <div className="text-center mt-3">
      <button className="btn btn-secondary">Voreinstellungen importieren</button>
    </div>
  </div>
);

export default Modules;
