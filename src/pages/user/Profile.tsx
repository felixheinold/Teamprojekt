import { useUser } from "../../context/UserContext";

const Profile = () => {
  const { user } = useUser();

  if (!user) {
    return <p>Kein Benutzer angemeldet.</p>;
  }

  return (
    <div className="text-center">
      <h2>👤 Profil</h2>
      <img
        src={`/avatars/${user.avatar}`}
        alt="Profilbild"
        className="rounded-circle my-3"
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
      <p><strong>Benutzername:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Profile;

