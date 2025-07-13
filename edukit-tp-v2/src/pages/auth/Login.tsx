import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AuthLayout from "./AuthLayout";
import { useTranslation } from "react-i18next";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API = import.meta.env.VITE_API_BASE_URL;

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || t("login.error"));
        return;
      }

      const user = result.user;
      const token = result.token;

      if (!user) {
        alert(t("login.noUserData"));
        return;
      }

      setUser({
        userId: user.userId,
        userName: user.userName,
        userMail: user.userMail,
        userProfilePicture: user.userProfilePicture,
        userGameInfo: user.userGameInfo || { highscore: 0, lastGameDate: null },
      });

      if (token) {
        localStorage.setItem("token", token);
      }

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      alert(t("login.unknownError"));
    }
  };

  return (
    <AuthLayout>
      <div className="login-content">
        <button
          className="btn btn-dark loginback-button align-self-start"
          onClick={() => navigate("/")}
        >
          ← {t("common.back")}
        </button>

        <h2 className="login-title fw-bold">{t("login.title")}</h2>
        <p className="login-subtitle mb-4">
          {t("login.subtitle", { app: "EduKIT" })}
        </p>

        <form onSubmit={handleSubmit}>
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

          {/* Passwortfeld mit Sichtbarkeitstoggle */}
          <div className="position-relative mb-3">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder={t("login.password")}
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

          <button
            type="submit"
            className="btn btn-dark login-button w-100 mb-2"
          >
            {t("login.button")}
          </button>

          <a href="#" className="password-forgot small">
            {t("login.forgotPassword")}
          </a>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
