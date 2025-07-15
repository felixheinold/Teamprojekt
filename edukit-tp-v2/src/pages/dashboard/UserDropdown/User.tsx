// User.tsx
import { useUser } from "../../../context/UserContext";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./User.css";

const User = () => {
  const { user, setUser } = useUser();
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    userName: user?.userName || "",
    userMail: user?.userMail || "",
  });

  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("userStats") || "{}");
    const sum = Object.values(stats).reduce(
      (acc: number, val: any) => acc + (val.totalPoints || 0),
      0
    );
    setTotalPoints(sum);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      userName: form.userName,
      userMail: form.userMail,
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
            src={user.userProfilePicture || "/avatars/default.png"}
            alt="Avatar"
            className="user-avatar"
          />
          <div>
            <h5 className="user-name">{user.userName}</h5>
            <small className="user-email">
              {t("user.loggedInAs")} {user.userMail}
            </small>
          </div>
        </div>

        <div className="user-group">
          <label>{t("user.username")}</label>
          <div className="user-input-row">
            <input
              type="text"
              name="userName"
              value={form.userName}
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
              name="userMail"
              value={form.userMail}
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
