import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { user } = useUser();
  const { t, i18n } = useTranslation();

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
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow-sm" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h5 className="card-title text-center">⚙️ {t("settings.title")}</h5>

          {!user && (
            <p className="text-muted small text-center">
              {t("settings.guestNotice")}
            </p>
          )}

          <div className="form-group mb-3">
            <label htmlFor="volume" className="form-label">🔊 {t("settings.volume")}</label>
            <input
              type="range"
              className="form-range"
              id="volume"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
            <div className="text-end small text-muted">{volume}%</div>
          </div>

          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="darkmode"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <label className="form-check-label" htmlFor="darkmode">
              🌙 {t("settings.darkMode")}
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label">🌐 {t("settings.language")}</label>
            <select
              className="form-select"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>

          <button className="btn btn-primary w-100" onClick={handleSave}>
            {t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
