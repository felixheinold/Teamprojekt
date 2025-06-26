import { useNavigate } from "react-router-dom";

const Start = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between min-vh-100 py-5">
      {/* Textseite */}
      <div className="text-center text-lg-start mb-5 mb-lg-0" style={{ flex: 1 }}>
        <h1 className="display-5 fw-bold mb-4">
          Study Smarter with <span className="text-success">EduKIT</span>!
        </h1>
        <p className="text-muted fs-5 mb-5">
          Tough exam coming up?<br />
          We’ve got your back – with quick and fun mini-games to boost your exam prep!
        </p>

        <div className="d-flex flex-column gap-3" style={{ maxWidth: "280px" }}>
          <button
            className="btn btn-dark fs-6 py-2"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn btn-dark fs-6 py-2"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>

      {/* Bildseite */}
      <div className="text-end" style={{ flex: 1 }}>
        <img
          src="/images/books1.png"
          alt="Books Illustration"
          className="img-fluid"
          style={{ maxWidth: "500px", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default Start;
