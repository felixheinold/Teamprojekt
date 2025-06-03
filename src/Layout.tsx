import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { useAppFlow } from "./context/AppFlowContext";

const Layout = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/"); // Zurück zur Startseite
  };

  const { selectedModule, selectedChapter } = useAppFlow();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success px-3">
        <Link to="/home" className="navbar-brand fw-bold">
          EduKIT
        </Link>

        {/* Toggle Button für mobile Ansicht */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Bereich */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Linke Navigation */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/modules" className="nav-link">
                Module
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to={
                  selectedModule
                    ? `/chapters/${encodeURIComponent(selectedModule)}`
                    : "#"
                }
                onClick={(e) => {
                  if (!selectedModule) e.preventDefault();
                }}
                className={`nav-link ${
                  !selectedModule ? "text-muted disabled" : ""
                }`}
              >
                Kapitel
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to={
                  selectedModule && selectedChapter
                    ? `/minigames/${encodeURIComponent(
                        selectedModule
                      )}/${encodeURIComponent(selectedChapter)}`
                    : "#"
                }
                onClick={(e) => {
                  if (!selectedChapter) e.preventDefault();
                }}
                className={`nav-link ${
                  !selectedChapter ? "text-muted disabled" : ""
                }`}
              >
                Minigames
              </Link>
            </li>
          </ul>

          {/* Rechte Navigation */}
          <ul className="navbar-nav d-flex align-items-center gap-2">
            <li className="nav-item d-flex align-items-center">
              <Link to="/settings" className="nav-link">
                <img
                  src="/images/settings.png"
                  alt="Einstellungen"
                  style={{ width: "20px", height: "20px" }}
                  className="me-1"
                />
                <span className="d-none d-md-inline">Einstellungen</span>
              </Link>
            </li>
            <li className="nav-item d-flex align-items-center">
              <Link
                to="/profile"
                className="nav-link d-flex align-items-center"
              >
                <img
                  src={`/avatars/${user?.avatar || "avatar1.png"}`}
                  alt="Profil"
                  className="rounded-circle me-1"
                  style={{ width: "32px", height: "32px", objectFit: "cover" }}
                />
                <span className="d-none d-md-inline">Profil</span>
              </Link>
            </li>
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="btn btn-outline-light btn-sm"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
