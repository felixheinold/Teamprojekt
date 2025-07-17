import { useBackendUserContext } from "../../../context/BackendUserContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthHandlingService } from "../../../firebaseData/authHandlingService";
import { GeneralAPICallsService } from "../../../firebaseData/generalAPICallsService";
import { auth } from "../../../firebaseData/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import "./User.css";

const User = () => {
  const { user, setUser } = useBackendUserContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const authHandlingService = new AuthHandlingService();
  const generalAPICallsService = new GeneralAPICallsService();

  const [form, setForm] = useState({
    user_name: user?.user_name || "",
    user_mail: user?.user_mail || "",
  });

  const totalPoints = user?.user_game_information?.total_points || 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user || !form.user_name.trim()) {
      alert(t("user.usernameRequired") || "Benutzername darf nicht leer sein.");
      return;
    }

    const newUsername = form.user_name.trim();

    try {
      await generalAPICallsService.updateUserField(user.user_id, {
        user_name: newUsername,
      });

      const updatedUser = {
        ...user,
        user_name: newUsername,
      };

      setUser(updatedUser);
      alert(t("user.updated"));
      setEditMode(false);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      alert(t("user.updateFailed") || "Speichern fehlgeschlagen.");
    }
  };

  const handleResetPassword = async () => {
    if (!user?.user_mail) return;

    const confirm = window.confirm(
      t("user.confirmResetPassword") || "Möchtest du dein Passwort wirklich zurücksetzen?"
    );
    if (!confirm) return;

    try {
      await authHandlingService.sendResetPasswordEmail(user.user_mail);
      alert(t("register.checkInbox"));
    } catch (err) {
      console.error("❌ Fehler beim Zurücksetzen des Passworts:", err);
      alert(t("user.resetPasswordFailed") || "Passwort-Reset fehlgeschlagen.");
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(
      t("user.confirmDelete") || "Möchtest du deinen Account wirklich löschen? Diese Aktion ist endgültig!"
    );
    if (!confirmDelete) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !user.user_mail) {
        throw new Error("Kein Benutzer angemeldet");
      }

      // 🔐 Reauthentication erforderlich
      const password = prompt("Bitte gib dein Passwort zur Bestätigung ein:");
      if (!password) return;

      const credential = EmailAuthProvider.credential(user.user_mail, password);
      await reauthenticateWithCredential(currentUser, credential);

      // 🗑️ Auth und Firestore löschen
      await currentUser.delete();
      await generalAPICallsService.deleteUser(user.user_id);

      setUser(null);
      alert(t("user.deleted") || "Dein Account wurde gelöscht.");
      navigate("/");
    } catch (err) {
      console.error("❌ Fehler beim Löschen des Accounts:", err);
      alert(t("user.deleteFailed") || "Account konnte nicht gelöscht werden.");
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
          <button
            className="user-reset-btn user-wide-btn"
            onClick={handleResetPassword}
          >
            🔑 {t("user.resetPassword")}
          </button>
        </div>

        <hr className="user-divider" />

        <div className="user-delete">
          <button
            className="user-delete-btn user-wide-btn"
            onClick={handleDelete}
          >
            🗑️ {t("user.deleteAccount")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
