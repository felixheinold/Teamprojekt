import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthHandlingService } from "../../firebaseData/authHandlingService";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const oobCode = params.get("oobCode");
  const authHandlingService = new AuthHandlingService();

  const handleReset = async () => {
    if (!oobCode) return alert("Ungültiger Link");
    await authHandlingService.confirmPasswordAfterReset(oobCode, newPassword);
    navigate("/login");
  };

  return (
    <div>
      <h2>Neues Passwort setzen</h2>
      <p>Bitte neues Passwort setzen und bestätigen. Anschließend erfolgt Weiterleitung zu Login.</p>
      <input
        type="password"
        placeholder="Neues Passwort"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleReset}>Bestätigen</button>
    </div>
  );
};

export default ResetPassword;
