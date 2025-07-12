import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAppFlow } from "./context/AppFlowContext";
import { useTranslation } from "react-i18next";
import UserDropdown from "./components/UserDropdown";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./Layout.css";

const Layout = () => {
  const { selectedModule, selectedChapter } = useAppFlow();
  const { t } = useTranslation();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid px-3">
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

          <div className="collapse navbar-collapse mt-2 mt-lg-0" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
              <li className="nav-item">
                <Link to="/modules" className="nav-link">
                  {t("layout.modules")}
                </Link>
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
                  {t("layout.chapters")}
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
                  {t("layout.minigames")}
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav d-flex align-items-center ms-auto">
              <li className="nav-item dropdown">
                <UserDropdown />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container-fluid py-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
