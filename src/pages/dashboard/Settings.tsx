import { useEffect, useState } from "react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="card mx-auto" style={{ maxWidth: "500px" }}>
      <div className="card-body">
        <h5 className="card-title text-center">⚙️ Einstellungen</h5>

        <div className="form-group mb-3">
          <label htmlFor="volume" className="form-label">🔊 Lautstärke</label>
          <input type="range" className="form-range" id="volume" min="0" max="100" />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="darkmode"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <label className="form-check-label" htmlFor="darkmode">
            🌙 Dark Mode aktivieren
          </label>
        </div>

        <button className="btn btn-primary w-100">Speichern</button>
      </div>
    </div>
  );
};

export default Settings;
