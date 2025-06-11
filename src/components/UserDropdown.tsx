import { useUser } from "../context/UserContext";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserDropdown = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
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

  if (!user) return null;

  const getInitials = () => {
    return user.username
      .split(" ")
      .map((name) => name[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
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
      >
        {user.avatar ? (
          <img
            src={`/avatars/${user.avatar}`}
            alt="Avatar"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span>{getInitials()}</span>
        )}
      </div>

      {/* Dropdown-Menü */}
      {open && (
        <div
          className="dropdown-menu show shadow"
          style={{
            position: "absolute",
            right: 0,
            top: "48px",
            minWidth: "180px",
            borderRadius: "8px",
            padding: "0.5rem 0",
            backgroundColor: "#f9f9f9",
            animation: "fadeIn 0.2s ease-in-out",
            zIndex: 1000,
          }}
        >
          <div className="dropdown-item-text px-3 small text-muted">
            {user.email}
          </div>
          <div className="dropdown-divider"></div>
          <Link to="/user" className="dropdown-item text-dark">
            👤 Profil
          </Link>
          <Link to="/settings" className="dropdown-item text-dark">
            ⚙️ Einstellungen
          </Link>
          <Link to="/stats" className="dropdown-item text-dark">
            📊 Statistik
          </Link>
          <Link to="/leaderboard" className="dropdown-item text-dark">
            🏆 Leaderboard
          </Link>
          <div className="dropdown-divider"></div>
          <button onClick={handleLogout} className="dropdown-item text-danger">
            🚪 Abmelden
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .dropdown-item:hover {
            background-color: #f0f0f0;
          }
        `}
      </style>
    </div>
  );
};

export default UserDropdown;
