import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AuthLayout from "./AuthLayout";
import { AuthHandlingService } from "../../firebaseData/authHandlingService";
import "./Login.css"

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const authHandlingService = new AuthHandlingService();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // const API = import.meta.env.VITE_API_BASE_URL;

    // try {
    //   const res = await fetch(`${API}/auth/login`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email: form.email,
    //       password: form.password,
    //     }),
    //   });

    //   const result = await res.json();

    //   if (!res.ok) {
    //     alert(result.error || "Login fehlgeschlagen.");
    //     return;
    //   }

    //   const user = result.user;
    //   const token = result.token;

    //   if (!user) {
    //     alert("Benutzerdaten fehlen in der Antwort.");
    //     return;
    //   }

    //   setUser({
    //     userId: user.userId,
    //     userName: user.userName,
    //     userMail: user.userMail,
    //     userProfilePicture: user.userProfilePicture,
    //     userGameInfo: user.userGameInfo || { highscore: 0, lastGameDate: null },
    //   });

    //   if (token) {
    //     localStorage.setItem("token", token);
    //   }

    try {
      const user = await authHandlingService.login(form.email, form.password)
      if (await authHandlingService.checkEmailVerified(user)){
        navigate("/home");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Etwas ist schiefgelaufen.");
    }
  };

  const handleForgottenPassword = () => {};

  return (
    <AuthLayout>
      <h2 className="fw-bold">Login</h2>
      <p className="text-muted mb-4">
        Willkommen zurück bei <strong>EduKIT</strong>.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          className="form-control mb-2"
          placeholder="u....@student.kit.edu / ...@kit.edu"
          onChange={handleChange}
          required
          pattern=".+@(student\.kit\.edu|kit\.edu)"
          title="Nur KIT-E-Mail-Adressen erlaubt. Only KIT mail addresses valid."
        />
        <input
          name="password"
          type="password"
          className="form-control mb-3"
          placeholder="Passwort/password"
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-dark w-100 mb-2">
          Sign In
        </button>
        <a href="#" className="text-muted small" onClick={handleForgottenPassword}>Passwort vergessen? Forgot password?</a>
      </form>
    </AuthLayout>
  );
};

export default Login;
