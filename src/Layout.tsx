import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { useAppFlow } from "./context/AppFlowContext";
import UserDropdown from "./components/UserDropdown";

const Layout = () => {
  const { selectedModule, selectedChapter } = useAppFlow();
  const { user } = useUser();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success px-3">
        <Link to="/home" className="navbar-brand fw-bold">
          EduKIT
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/modules" className="nav-link">Module</Link>
            </li>
            <li className="nav-item">
              <Link
                to={
                  selectedModule
                    ? `/chapters/${encodeURIComponent(selectedModule)}`
                    : "#"
                }
                onClick={(e) => !selectedModule && e.preventDefault()}
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
                onClick={(e) => !selectedChapter && e.preventDefault()}
                className={`nav-link ${
                  !selectedChapter ? "text-muted disabled" : ""
                }`}
              >
                Minigames
              </Link>
            </li>
          </ul>

          {user && (
            <ul className="navbar-nav d-flex align-items-center">
              <li className="nav-item">
                <UserDropdown />
              </li>
            </ul>
          )}
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
