import { useBackendUserContext } from "../../../context/BackendUserContext";
import { useState } from "react";
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
    const updatedUser = {
      ...user,
      user_name: form.user_name,
      user_mail: form.user_mail,
    };
    setUser(updatedUser);
    setEditMode(false);
    alert(t("user.updated"));
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      t("user.confirmDelete") ||
        "Möchtest du deinen Account wirklich löschen? Diese Aktion ist endgültig!"
    );
    if (confirmDelete) {
      console.log("Account wird gelöscht...");
      setUser(null);
      alert(t("user.deleted") || "Dein Account wurde gelöscht.");
    }
  };

  if (!user) {
    return <p className="user-message">⚠️ {t("user.noUser")}</p>;
  }

  return (
    <div className="user-wrapper">
      <div className="user-card">
        <h2 className="user-title">👤 {t("user.title")}</h2>

        <div className="user-points user-points-top">
          📊 <strong>{totalPoints}</strong> {t("user.totalPoints")}
        </div>

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
            <div className="user-edit-actions">
              <button
                className="user-edit-btn"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? t("common.cancel") : t("common.edit")}
              </button>

              {editMode && (
                <button className="user-save" onClick={handleSave}>
                  {t("common.save")}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="user-group">
          <label>{t("user.email")}</label>
          <div className="user-input-row">
            <input
              type="email"
              name="user_mail"
              value={form.user_mail}
              disabled
              readOnly
            />
          </div>
        </div>

        <div className="user-reset">
          <button className="user-reset-btn user-wide-btn">
            🔑 {t("user.resetPassword")}
          </button>
        </div>

        <hr className="user-divider" />

        <div className="user-delete">
          <button className="user-delete-btn user-wide-btn" onClick={handleDelete}>
            🗑️ {t("user.deleteAccount") || "Account löschen"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
