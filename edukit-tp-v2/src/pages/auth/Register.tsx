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
    avatar: "avatar1.png",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        headers: {
          "Content-Type": "application/json",
        },
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

      // Direkt zu /home → dort wird ggf. Disclaimer angezeigt
      navigate("/home");
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
            className="btn btn-dark back-button align-self-start"
            onClick={() => navigate("/")}
          >
            ← {t("common.back")}
          </button>

          <h2 className="fw-bold">{t("register.title")}</h2>
          <p className="mb-3">
            <em>{t("register.chooseAvatar")}</em>
          </p>

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
            <input
              name="password"
              type="password"
              className="form-control mb-3"
              placeholder={t("register.password")}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn btn-dark w-100">
              {t("register.button")}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
