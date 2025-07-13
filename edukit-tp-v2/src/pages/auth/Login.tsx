import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AuthLayout from "./AuthLayout";
import { AuthHandlingService } from "../../firebaseData/authHandlingService";
import { useTranslation } from "react-i18next";
import "./Login.css"; // NEU: CSS importieren

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const {t} = useTranslation();

    const authHandlingService = new AuthHandlingService();

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

    try {
      const user = await authHandlingService.login(form.email, form.password)
      if (await authHandlingService.checkEmailVerified(user)){
        navigate("/home");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert(t("login.unknownError"));
    }
  };


  const handleForgottenPassword = async () => {
    try {
      await authHandlingService.sendResetPasswordEmail(form.email);
      alert("Bitte checke deinen Mail-Eingang. Please check your mail inbox.");
      navigate("/reset-password");
    } catch (err){
      console.error("Reset password error: ", err);
    }
  };

  const anotherVerificationMail = async() =>{
    try{
      await authHandlingService.sendVerificationMailAgain();
    }catch (err){
      console.error("Verification mail error.")
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
          <a href="#" className="text-muted small" onClick = {handleForgottenPassword}>
            {t("login.forgotPassword")}
          </a>
          <p></p>
           <a href="#" className="text-muted small" onClick = {anotherVerificationMail}>
            <span>{t("login.anotherMail")}</span>
          </a>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
