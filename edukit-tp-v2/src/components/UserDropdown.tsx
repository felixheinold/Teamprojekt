import { useUser } from "../context/UserContext";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserDropdown = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user?.userName) return "?";
    return user.userName
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
          width: "40px",
          height: "40px",
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
        {user?.userProfilePicture ? (
          <img
            src={user.userProfilePicture}
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
          {user ? (
            <>
              <div className="dropdown-item-text px-3 small text-muted">
                {user.userMail}
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/user" className="dropdown-item text-dark">👤 {t("userDropdown.profile")}</Link>
              <Link to="/settings" className="dropdown-item text-dark">⚙️ {t("userDropdown.settings")}</Link>
              <Link to="/stats" className="dropdown-item text-dark">📊 {t("userDropdown.stats")}</Link>
              <Link to="/leaderboard" className="dropdown-item text-dark">🏆 {t("userDropdown.leaderboard")}</Link>
              <Link to="/guidelines" className="dropdown-item text-dark">🧭 {t("userDropdown.guidelines")}</Link>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item text-danger">
                🚪 {t("userDropdown.logout")}
              </button>
            </>
          ) : (
            <>
              <div className="dropdown-item-text px-3 small text-muted">
                {t("userDropdown.guest")}
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/settings" className="dropdown-item text-dark">⚙️ {t("userDropdown.settings")}</Link>
              <Link to="/guidelines" className="dropdown-item text-dark">🧭 {t("userDropdown.guidelines")}</Link>
              <Link to="/login" className="dropdown-item text-primary">🔐 {t("userDropdown.login")}</Link>
              <Link to="/register" className="dropdown-item text-primary">📝 {t("userDropdown.register")}</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        .custom-dropdown {
          position: absolute;
          right: 0;
          top: 48px;
          min-width: 180px;
          border-radius: 8px;
          padding: 0.5rem 0;
          background-color: #f9f9f9;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.2s ease-in-out;
          z-index: 1000;
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
