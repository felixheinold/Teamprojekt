// User.tsx
import { useBackendUserContext } from "../../../context/BackendUserContext";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./User.css";

const User = () => {
  const { user, setUser } = useBackendUserContext();
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    user_name: user?.user_name || "",
    user_mail: user?.user_mail || "",
  });

  const totalPoints = user?.user_game_information.total_points || 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!user) return;

    const trimmedName = form.user_name.trim();
    const trimmedMail = form.user_mail.trim();

    const noChanges =
      trimmedName === user.user_name && trimmedMail === user.user_mail;

    if (noChanges) {
      setEditMode(false); // Nur UI schließen
      return;
    }

    const updatedUser = {
      ...user,
      user_name: trimmedName,
      user_mail: trimmedMail,
    };

    setUser(updatedUser);
    setEditMode(false);
    alert(t("user.updated"));
  };

  if (!user) {
    return <p className="user-message">⚠️ {t("user.noUser")}</p>;
  }

  return (
    <div className="user-wrapper">
      <div className="user-card">
        <h2 className="user-title">👤 {t("user.title")}</h2>

        <div className="user-avatar-section">
          <img
            src={
              user.user_profile_picture
                ? `/avatars/${user.user_profile_picture}`
                : "/avatars/default.png"
            }
            alt="Avatar"
            className="user-avatar"
          />

          <div>
            <h5 className="user-name">{user.user_name}</h5>
            <small className="user-email">
              {t("user.loggedInAs")} {user.user_mail}
            </small>
          </div>
        </div>

        <div className="user-group">
          <label>{t("user.username")}</label>
          <div className="user-input-row">
            <input
              type="text"
              name="user_name"
              value={form.user_name}
              disabled={!editMode}
              onChange={handleChange}
            />
            <button
              className="user-edit-btn"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? t("common.cancel") : t("common.edit")}
            </button>
          </div>
        </div>

        <div className="user-group">
          <label>{t("user.email")}</label>
          <div className="user-input-row">
            <input
              type="email"
              name="user_mail"
              value={form.user_mail}
              disabled={!editMode}
              onChange={handleChange}
            />
            <button
              className="user-edit-btn"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? t("common.cancel") : t("common.edit")}
            </button>
          </div>
        </div>

        {editMode && (
          <div className="user-actions">
            <button className="user-save" onClick={handleSave}>
              {t("common.save")}
            </button>
          </div>
        )}

        <div className="user-reset">
          <button className="user-reset-btn">
            🔑 {t("user.resetPassword")}
          </button>
        </div>

        <hr className="user-divider" />

        <div className="user-points">
          📊 <strong>{totalPoints}</strong> {t("user.totalPoints")}
        </div>
      </div>
    </div>
  );
};

export default User;
