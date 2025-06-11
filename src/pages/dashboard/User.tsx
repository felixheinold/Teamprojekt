import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";

const User = () => {
  const { user, setUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("userStats") || "{}");
    const sum = Object.values(stats).reduce((acc: number, val: any) => acc + (val.totalPoints || 0), 0);
    setTotalPoints(sum);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser({ ...user!, ...form });
    setEditMode(false);
    alert("Profil aktualisiert (Demo)");
  };

  if (!user) return <p>Kein Benutzer angemeldet.</p>;

  return (
    <div className="container mt-4">
      <div className="bg-dark text-white rounded p-4 shadow-lg" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h3 className="fw-bold mb-4">👤 Mein Account</h3>

        <div className="d-flex align-items-center mb-4">
          <img
            src={`/avatars/${user.avatar}`}
            alt="Avatar"
            className="rounded-circle me-3"
            style={{ width: "70px", height: "70px", objectFit: "cover" }}
          />
          <div>
            <h5 className="mb-0">{user.username}</h5>
            <small className="text-muted">Angemeldet als {user.email}</small>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Benutzername</label>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              name="username"
              value={form.username}
              disabled={!editMode}
              onChange={handleChange}
            />
            <button
              className="btn btn-secondary"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Abbrechen" : "Bearbeiten"}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">E-Mail</label>
          <div className="d-flex gap-2">
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              disabled={!editMode}
              onChange={handleChange}
            />
            <button
              className="btn btn-secondary"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Abbrechen" : "Bearbeiten"}
            </button>
          </div>
        </div>

        {editMode && (
          <div className="text-end">
            <button className="btn btn-success" onClick={handleSave}>
              Speichern
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <button className="btn btn-outline-danger">🔑 Passwort zurücksetzen</button>
        </div>

        <hr className="my-4" />
        <div className="text-center">
          <p className="fs-5">📊 <strong>{totalPoints}</strong> Gesamtpunkte gesammelt</p>
        </div>
      </div>
    </div>
  );
};

export default User;