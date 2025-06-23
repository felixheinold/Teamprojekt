import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AuthLayout from "./AuthLayout";
import AvatarPicker from "../../components/AvatarPicker";

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

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

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Registrierung fehlgeschlagen.");
        return;
      }

      const result = await res.json();
      setUser(result.user); // speichert Firestore-User
      localStorage.setItem("token", result.token); // optional, wenn du später sichere Endpunkte brauchst

      navigate("/home");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Etwas ist schiefgelaufen.");
    }
  };

  return (
    <AuthLayout>
      <h2 className="fw-bold">Create Account</h2>
      <p className="mb-3"><em>Choose your icon:</em></p>

      <AvatarPicker
        value={form.avatar}
        onChange={(avatar) => setForm({ ...form, avatar })}
      />

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          className="form-control mb-2"
          placeholder="Username"
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
        <button type="submit" className="btn btn-dark w-100">Register</button>
      </form>
    </AuthLayout>
  );
};

export default Register;
