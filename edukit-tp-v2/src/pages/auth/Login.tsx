import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AuthLayout from "./AuthLayout";
import { AuthHandlingService } from "../../firebaseData/authHandlingService";
import { AuthAPICallsService } from "../../firebaseData/authAPICallsService";
import { useBackendUserContext } from "../../context/BackendUserContext";
import { GeneralAPICallsService } from "../../firebaseData/generalAPICallsService";
import { useTranslation } from "react-i18next";
import "./Login.css"; // NEU: CSS importieren
import { AuthPopupError } from "../../firebaseData/firebaseDataModels";
import { useEffect } from "react";
import { auth } from "../../firebaseData/firebaseConfig";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const authHandlingService = new AuthHandlingService();
  const authAPICallsService = new AuthAPICallsService();
  const { setUser } = useBackendUserContext();
  const generalAPICallsService = new GeneralAPICallsService();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [signoutDone, setSignoutDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    auth.signOut().then(() => {
      localStorage.clear(); // falls du was speicherst
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

      if (await authHandlingService.checkEmailVerified(userCredential)) {
        const firebaseUser = auth.currentUser;

        if (firebaseUser) {
          // Backend-Daten abrufen
          const userData =
            await generalAPICallsService.getUserDataFromFirestore(
              firebaseUser.uid
            );

          // In globalen Kontext setzen
          setUser(userData);

          navigate("/home");
          console.log("USERDATA VOM BACKEND:", userData);
        } else {
          throw new Error("Firebase user is null after login");
        }
      }
    } catch (err) {
      if (err instanceof AuthPopupError) {
        alert(t("login.wrongCredentials"));
      } else {
        console.error("Login error:", err);
        alert(t("login.unknownError"));
      }
    }
  };

  const handleForgottenPassword = async () => {
    try {
      await authHandlingService.sendResetPasswordEmail(form.email);
      alert(t("register.checkInbox"));
      navigate("/reset-password");
    } catch (err) {
      console.error("Reset password error: ", err);
    }
  };

  const anotherVerificationMail = async () => {
    try {
      await authHandlingService.sendVerificationMailAgain();
    } catch (err) {
      console.error("Verification mail error.");
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
          <a
            href="#"
            className="password-forgot small"
            onClick={handleForgottenPassword}
          >
            {t("login.forgotPassword")}
          </a>
          <p></p>
          <a
            href="#"
            className="next-mail small"
            onClick={anotherVerificationMail}
          >
            <span>{t("login.anotherMail")}</span>
          </a>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
