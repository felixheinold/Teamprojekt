import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AuthLayout from "../auth/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API = import.meta.env.VITE_API_BASE_URL;

    try {
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Login fehlgeschlagen.");
        return;
      }

      const result = await res.json(); // erwartet { user, token }
      setUser(result.user);            // nur das User-Objekt speichern
      localStorage.setItem("token", result.token); // Token speichern (optional)
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      alert("Etwas ist schiefgelaufen.");
    }
  };

  return (
    <AuthLayout>
      <h2 className="fw-bold">Log in</h2>
      <p className="text-muted mb-4">Willkommen zurück bei <strong>EduKIT</strong>.</p>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          className="form-control mb-2"
          placeholder="u....@student.kit.edu"
          onChange={handleChange}
          required
          pattern=".+@student.kit.edu"
          title="Nur KIT-E-Mail-Adressen erlaubt"
        />
        <input
          name="password"
          type="password"
          className="form-control mb-3"
          placeholder="Passwort"
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-dark w-100 mb-2">Sign In</button>
        <a href="#" className="text-muted small">Passwort vergessen?</a>
      </form>
    </AuthLayout>
  );
};

export default Login;
