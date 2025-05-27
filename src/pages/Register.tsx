import profileImg from "../assets/profile.png";

const Register = () => (
  <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
    <h1 className="mb-4 bg-warning px-3 py-2 rounded">Erstmalige Anmeldung</h1>

    <img
      src={profileImg}
      alt="Profilbild"
      className="rounded-circle border border-success shadow mb-3"
      style={{ width: 120, height: 120, objectFit: "cover" }}
    />

    <div className="w-100" style={{ maxWidth: 400 }}>
      <input type="text" placeholder="Username" className="form-control mb-2" />
      <input type="email" placeholder="u...@" className="form-control mb-2" />
      <input type="password" placeholder="Passwort" className="form-control mb-3" />
      <button className="btn btn-primary w-100">registrieren (verifizieren)</button>
    </div>
  </div>
);

export default Register;
