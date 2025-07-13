import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AuthLayout from "./AuthLayout";
import AvatarPicker from "../../components/AvatarPicker";
import { useTranslation } from "react-i18next";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "avatar1.png",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationInfoVisible, setRegistrationInfoVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert(
        t("register.passwordMismatch") || "Passwörter stimmen nicht überein."
      );
      return;
    }

    const API = import.meta.env.VITE_API_BASE_URL;
    const userId = crypto.randomUUID();

    const payload = {
      userId,
      userName: form.username,
      userMail: form.email,
      userPassword: form.password,
      userProfilePicture: form.avatar,
      userGameInfo: {
        highscore: 0,
        lastGameDate: null,
      },
    };

    try {
      const res = await fetch(`${API}/users/new-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || t("register.error"));
        return;
      }

      setUser({
        userId,
        userName: form.username,
        userMail: form.email,
        userProfilePicture: form.avatar,
        userGameInfo: {
          highscore: 0,
          lastGameDate: null,
        },
      });

      setRegistrationInfoVisible(true); // Info anzeigen statt direkt navigieren
    } catch (err) {
      console.error("Registration error:", err);
      alert(t("register.unknownError"));
    }
  };

  return (
    <AuthLayout>
      <div className="d-flex register-wrapper align-items-start">
        <div className="register-gradient-bar"></div>

        <div className="register-content">
          <button
            className="btn btn-dark registerback-button align-self-start"
            onClick={() => navigate("/")}
          >
            ← {t("common.back")}
          </button>

          <h2 className="fw-bold">{t("register.title")}</h2>
          <p className="mb-3">
            <em>{t("register.chooseAvatar")}</em>
          </p>

          {!registrationInfoVisible ? (
            <>
              <AvatarPicker
                value={form.avatar}
                onChange={(avatar) => setForm({ ...form, avatar })}
              />

              <form onSubmit={handleSubmit}>
                <input
                  name="username"
                  type="text"
                  className="form-control mb-2"
                  placeholder={t("register.username")}
                  onChange={handleChange}
                  required
                />
                <input
                  name="email"
                  type="email"
                  className="form-control mb-2"
                  placeholder="u....@student.kit.edu"
                  onChange={handleChange}
                  required
                  pattern=".+@student.kit.edu"
                  title={t("login.kitOnly")}
                />

                <div className="position-relative mb-2">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder={t("register.password")}
                    onChange={handleChange}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                    }}
                    aria-label="Passwort anzeigen/verbergen"
                  >
                    {showPassword ? "↺" : "👁️‍🗨️"}
                  </span>
                </div>

                <div className="position-relative mb-3">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    placeholder={
                      t("register.confirmPassword") || "Passwort wiederholen"
                    }
                    onChange={handleChange}
                    required
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                    }}
                    aria-label="Passwort wiederholen anzeigen/verbergen"
                  >
                    {showConfirmPassword ? "↺" : "👁️‍🗨️"}
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark register-button w-100"
                >
                  {t("register.button")}
                </button>
              </form>
            </>
          ) : (
            <div className="register-info" role="alert">
              <h5>{t("register.infoHeadline")}</h5>
              <p>{t("register.infoText1")}</p>
              <p>{t("register.infoText2")}</p>
              <p>{t("register.infoText3")}</p>

              <button
                className="btn btn-success mt-3"
                onClick={() => navigate("/")}
              >
                {t("register.continueAfterInfo")}
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
