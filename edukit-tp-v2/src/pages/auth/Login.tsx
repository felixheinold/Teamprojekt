import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { AuthHandlingService } from "../../firebaseData/authHandlingService";
import { useTranslation } from "react-i18next";
import "./Login.css";
import { AuthPopupError } from "../../firebaseData/firebaseDataModels";
import { auth } from "../../firebaseData/firebaseConfig";
import { AuthAPICallsService } from "../../firebaseData/authAPICallsService";
import { GeneralAPICallsService } from "../../firebaseData/generalAPICallsService";
import { useBackendUserContext } from "../../context/BackendUserContext";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const authHandlingService = new AuthHandlingService();
  const authAPICallsService = new AuthAPICallsService();
  const generalAPICallsService = new GeneralAPICallsService();
  const { setUser } = useBackendUserContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [signoutDone, setSignoutDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    auth.signOut().then(() => {
      localStorage.clear();
      sessionStorage.clear();
      setSignoutDone(true);
    });
  }, []);

  if (!signoutDone) return <div>Wird geladen...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await authHandlingService.login(
        form.email,
        form.password
      );

      const user = auth.currentUser;

      if (user && (await authHandlingService.checkEmailVerified(user))) {
        try {
          const userData = await generalAPICallsService.getUserDataFromFirestore(
            user.uid
          );

          setUser(userData);
          navigate("/home");
          console.log("✅ Backend-Daten geladen:", userData);
        } catch (backendErr: any) {
          console.error("❌ Fehler beim Abrufen der Nutzerdaten:", backendErr);
          alert(
            t("login.backendUserMissing") ||
              "Benutzerdaten konnten nicht geladen werden. Kontaktiere den Support."
          );
        }
      } else {
        alert(t("login.verifyEmailFirst") || "Bitte bestätige zuerst deine E-Mail-Adresse.");
      }
    } catch (err: any) {
      if (err instanceof AuthPopupError || err.code === "auth/wrong-password") {
        alert(t("login.wrongCredentials") || "Falsche E-Mail oder Passwort.");
      } else if (err.code === "auth/user-not-found") {
        alert("Benutzer nicht gefunden.");
      } else {
        console.error("❌ Login error:", err);
        alert(t("login.unknownError") || "Unbekannter Fehler beim Login.");
      }
    }
  };

  const handleForgottenPassword = async () => {
    try {
      await authHandlingService.sendResetPasswordEmail(form.email);
      alert(t("register.checkInbox"));
      navigate("/reset-password");
    } catch (err) {
      console.error("❌ Fehler beim Zurücksetzen des Passworts:", err);
      alert("Fehler beim Senden der E-Mail zum Zurücksetzen des Passworts.");
    }
  };

  const anotherVerificationMail = async () => {
    try {
      await authHandlingService.sendVerificationMailAgain();
      alert(t("register.checkInbox"));
    } catch (err) {
      console.error("❌ Fehler beim erneuten Versenden der Verifizierungs-E-Mail:", err);
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
            placeholder="u....@student.kit.edu / name@kit.edu"
            onChange={handleChange}
            required
            pattern=".+@(student\.kit\.edu|kit\.edu)"
            title={t("login.kitOnly")}
          />

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

          <button type="submit" className="btn btn-dark login-button w-100 mb-2">
            {t("login.button")}
          </button>

          <a href="#" className="password-forgot small" onClick={handleForgottenPassword}>
            {t("login.forgotPassword")}
          </a>
          <p></p>
          <a href="#" className="next-mail small" onClick={anotherVerificationMail}>
            <span>{t("login.anotherMail")}</span>
          </a>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
