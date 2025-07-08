// src/pages/auth/Start.tsx
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Start.css";

const Start = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between min-vh-100 py-5 px-3 px-sm-4 px-md-5">
      {/* Textseite */}
      <div className="text-center text-lg-start mb-4 mb-lg-0 flex-grow-1 start-content">
        <h1 className="start-title fw-bold mb-4">
          {t("start.title.part1")}{" "}
          <span className="text-success">{t("start.title.part2")}</span>
        </h1>

        <p className="start-subtitle text-muted mb-4">
          {t("start.subtitle.line1")}
          <br />
          {t("start.subtitle.line2")}
        </p>

        <div
          className="d-flex flex-column gap-3 mx-auto mx-lg-0"
          style={{ maxWidth: "280px" }}
        >
          <button
            className="btn btn-dark start-button"
            onClick={() => navigate("/login")}
          >
            {t("start.login")}
          </button>
          <button
            className="btn btn-dark start-button"
            onClick={() => navigate("/register")}
          >
            {t("start.register")}
          </button>
        </div>
      </div>

      {/* Bildseite */}
      <div className="text-end flex-grow-1">
        <img
          src="/images/books1.png"
          alt={t("start.imageAlt")}
          className="img-fluid mx-auto d-block"
        />
      </div>
    </div>
  );
};

export default Start;
