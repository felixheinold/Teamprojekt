import { useNavigate } from "react-router-dom";
import "./Start.css"; // Importiere die neue CSS-Datei

const Start = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between min-vh-100 py-5 px-3 px-sm-4 px-md-5">
      {/* Textseite */}
      <div className="text-center text-lg-start mb-4 mb-lg-0 flex-grow-1 start-content">
        <h1 className="start-title fw-bold mb-4">
          Study Smarter with <span className="text-success">EduKIT!</span>
        </h1>
        <p className="start-subtitle text-muted mb-4">
          Tough exam coming up?
          <br />
          We’ve got your back – with quick and fun mini-games to boost your exam
          prep!
        </p>

        <div
          className="d-flex flex-column gap-3 mx-auto mx-lg-0"
          style={{ maxWidth: "280px" }}
        >
          <button
            className="btn btn-dark start-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn btn-dark start-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>

      {/* Bildseite */}
      <div className="text-end flex-grow-1">
        <img
          src="/images/books1.png"
          alt="Books Illustration"
          className="img-fluid mx-auto d-block"
        />
      </div>
    </div>
  );
};

export default Start;
