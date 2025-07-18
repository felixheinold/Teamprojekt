import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AuthLayout from "./AuthLayout";
import AvatarPicker from "../../components/AvatarPicker";
import { useTranslation } from "react-i18next";
import { AuthHandlingService } from "../../firebaseData/authHandlingService";
import { AuthAPICallsService } from "../../firebaseData/authAPICallsService";
import { auth } from "../../firebaseData/firebaseConfig";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { t } = useTranslation();
  const authHandlingService = new AuthHandlingService();
  const authAPICallsService = new AuthAPICallsService();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "avatar1.png",
  });

  const [signoutDone, setSignoutDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationInfoVisible, setRegistrationInfoVisible] = useState(false);

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

    if (form.password.length < 6) {
      alert("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert(t("register.passwordMismatch") || "Passwörter stimmen nicht überein.");
      return;
    }

    try {
      const user = await authHandlingService.newRegistration(
        form.username,
        form.email,
        form.password,
        form.avatar
      );

      // ✅ Backend aufrufen, um User in Firestore zu speichern
      if (user && user.uid) {
        await authAPICallsService.newUserAPICall(
          user.uid,
          form.username,
          form.email,
          form.avatar
        );
      }

      alert(t("register.checkInbox"));
      setRegistrationInfoVisible(true);
    } catch (err: any) {
      if (err.code === "wrong mail address format") {
        alert(t("register.invalidEmailFormat"));
      } else if (err.message === "auth/weak-password") {
        alert("Passwort ist zu schwach. Bitte wähle ein stärkeres Passwort mit mindestens 6 Zeichen.");
      } else if (err.message === "auth/email-already-in-use") {
        alert("Die E-Mail-Adresse wird bereits verwendet.");
      } else {
        console.error("Registration error:", err);
        alert(t("register.unknownError"));
      }
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
                  placeholder="u....@student.kit.edu / name@kit.edu"
                  onChange={handleChange}
                  required
                  pattern=".+@(student\.kit\.edu|kit\.edu)"
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
                    placeholder={t("register.confirmPassword")}
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
                <a
                  href="#"
                  className="next-mail small"
                  onClick={anotherVerificationMail}
                >
                  <span>{t("login.anotherMail")}</span>
                </a>
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
