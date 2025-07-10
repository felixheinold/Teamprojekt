import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const { user } = useUser();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Vorherige Route aus dem State oder Standardwert
  const from = (location.state as { from?: string })?.from || "/home";

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("volume");
    return saved ? Number(saved) : 50;
  });

  const [language, setLanguage] = useState(() => i18n.language || "de");

  useEffect(() => {
    document.body.classList.toggle("bg-dark", darkMode);
    document.body.classList.toggle("text-white", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("volume", String(volume));
  }, [volume]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
  };

  const handleSave = () => {
    alert(t("settings.saved") + "!");
    navigate(-1); // zurück zur vorherigen Seite
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-card">
        <h2 className="settings-title">⚙️ {t("settings.title")}</h2>

        {!user && <p className="settings-guest">{t("settings.guestNotice")}</p>}

        <div className="settings-group">
          <label htmlFor="volume">🔊 {t("settings.volume")}</label>
          <input
            type="range"
            id="volume"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <div className="settings-range-value">{volume}%</div>
        </div>

        <div className="settings-group switch">
          <input
            type="checkbox"
            id="darkmode"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <label htmlFor="darkmode">🌙 {t("settings.darkMode")}</label>
        </div>

        <div className="settings-group">
          <label htmlFor="language">🌐 {t("settings.language")}</label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>

        <button className="settings-button" onClick={handleSave}>
          {t("common.save")}
        </button>
      </div>
    </div>
  );
};

export default Settings;
