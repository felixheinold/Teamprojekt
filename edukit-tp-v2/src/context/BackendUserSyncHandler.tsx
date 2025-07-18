import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseData/firebaseConfig";
import { useBackendUserContext } from "./BackendUserContext";
import { GeneralAPICallsService } from "../firebaseData/generalAPICallsService";

export const BackendUserSyncHandler = () => {
  const { setUser, flushUser, user } = useBackendUserContext();
  const generalAPICallsService = new GeneralAPICallsService();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("🔁 Auth-State-Changed Trigger");

      if (firebaseUser && firebaseUser.emailVerified) {
        try {
          const userData =
            await generalAPICallsService.getUserDataFromFirestore();

          // Nur setzen, wenn sich die Daten geändert haben
          if (!user || JSON.stringify(user) !== JSON.stringify(userData)) {
            setUser(userData);
          }
        } catch (err) {
          console.error("Fehler beim Laden der Userdaten:", err);
        }
      } else {
        await flushUser();
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};
