import { useUser } from "../../../context/UserContext";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

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
    alert(t("user.updated")); // ✅ i18n
  };

  if (!user) {
    return (
      <p className="text-center mt-5">⚠️ {t("user.noUser")}</p>
    );
  }

  return (
    <div className="container mt-4">
      <div
        className="bg-dark text-white rounded p-4 shadow-lg"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <h3 className="fw-bold mb-4">👤 {t("user.title")}</h3>

        <div className="d-flex align-items-center mb-4">
          <img
            src={user.userProfilePicture || "/avatars/default.png"}
            alt="Avatar"
            className="rounded-circle me-3"
            style={{ width: "70px", height: "70px", objectFit: "cover" }}
          />
          <div>
            <h5 className="mb-0">{user.userName}</h5>
            <small className="text-muted">
              {t("user.loggedInAs")} {user.userMail}
            </small>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">{t("user.username")}</label>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              name="userName"
              value={form.userName}
              disabled={!editMode}
              onChange={handleChange}
            />
            <button
              className="btn btn-secondary"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? t("common.cancel") : t("common.edit")}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">{t("user.email")}</label>
          <div className="d-flex gap-2">
            <input
              type="email"
              className="form-control"
              name="userMail"
              value={form.userMail}
              disabled={!editMode}
              onChange={handleChange}
            />
            <button
              className="btn btn-secondary"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? t("common.cancel") : t("common.edit")}
            </button>
          </div>
        </div>

        {editMode && (
          <div className="text-end">
            <button className="btn btn-success" onClick={handleSave}>
              {t("common.save")}
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <button className="btn btn-outline-danger">
            🔑 {t("user.resetPassword")}
          </button>
        </div>

        <hr className="my-4" />
        <div className="text-center">
          <p className="fs-5">
            📊 <strong>{totalPoints}</strong> {t("user.totalPoints")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default User;
