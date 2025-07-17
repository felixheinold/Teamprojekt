import { useUser } from "../context/UserContext";
import { useBackendUserContext } from "../context/BackendUserContext";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserDropdown = () => {
  const { user, setUser } = useBackendUserContext();
  console.log("🔍 UserDropdown – aktueller User:", user);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Kein User = kein Dropdown
  if (!user) return null;

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setHelpOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setHelpOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const getInitials = () => {
    if (!user?.user_name) return "?";
    return user.user_name

      .split(" ")
      .map((name) => name[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="border-0 bg-transparent p-0"
        style={{
          width: "50px",
          height: "50px",
          cursor: "pointer",
          backgroundColor: "#e2e6ea",
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "#333",
        }}
        aria-label={t("userDropdown.openMenu")}
        tabIndex={0}
      >
        {user.user_profile_picture?.trim() ? (
          <img
            src={`/avatars/${user.user_profile_picture}`}
            alt="Avatar"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span>{getInitials()}</span>
        )}
      </button>

      {open && (
        <div className="dropdown-menu show custom-dropdown">
          <div className="dropdown-item-text px-3 small text-muted">
            {user.user_mail}
          </div>

          <div className="dropdown-divider"></div>

          <Link
            to="/user"
            onClick={() => setOpen(false)}
            className="dropdown-item text-dark"
          >
            👤 {t("userDropdown.profile")}
          </Link>
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className="dropdown-item text-dark"
          >
            ⚙️ {t("userDropdown.settings")}
          </Link>
          <Link
            to="/stats"
            onClick={() => setOpen(false)}
            className="dropdown-item text-dark"
          >
            📊 {t("userDropdown.stats")}
          </Link>
          <Link
            to="/leaderboard"
            onClick={() => setOpen(false)}
            className="dropdown-item text-dark"
          >
            🏆 {t("userDropdown.leaderboard")}
          </Link>

          <div
            className="dropdown-item text-dark d-flex justify-content-between align-items-center"
            onClick={() => setHelpOpen(!helpOpen)}
            style={{ cursor: "pointer" }}
          >
            🧭 {t("userDropdown.help")} <span>{helpOpen ? "▲" : "▼"}</span>
          </div>

          {helpOpen && (
            <div className="submenu px-3">
              <Link
                to="/help/FAQ"
                onClick={() => setOpen(false)}
                className="dropdown-item text-dark"
              >
                ❓ {t("help.faq")}
              </Link>
              <Link
                to="/help/Guidelines"
                onClick={() => setOpen(false)}
                className="dropdown-item text-dark"
              >
                📘 {t("help.guidelines")}
              </Link>
              <Link
                to="/help/DataPrivacy"
                onClick={() => setOpen(false)}
                className="dropdown-item text-dark"
              >
                🔒 {t("help.datenschutz")}
              </Link>
              <Link
                to="/help/Imprint"
                onClick={() => setOpen(false)}
                className="dropdown-item text-dark"
              >
                📄 {t("help.impressum")}
              </Link>
            </div>
          )}

          <div className="dropdown-divider"></div>
          <button onClick={handleLogout} className="dropdown-item text-danger">
            🚪 {t("userDropdown.logout")}
          </button>
        </div>
      )}

      <style>{`
        .custom-dropdown {
          position: absolute;
          right: 0;
          top: 48px;
          min-width: 200px;
          border-radius: 8px;
          padding: 0.5rem 0;
          background-color: #f9f9f9;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.2s ease-in-out;
          z-index: 1000;
        }

        .submenu {
          padding-left: 1rem;
          animation: fadeIn 0.2s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-item:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default UserDropdown;
