import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseData/firebaseConfig";
import { useBackendUserContext } from "./BackendUserContext";
import { GeneralAPICallsService } from "../firebaseData/generalAPICallsService";

export const BackendUserSyncHandler = () => {
  const { setUser, flushUser } = useBackendUserContext();
  const generalAPICallsService = new GeneralAPICallsService();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        try {
          const userData =
            await generalAPICallsService.getUserDataFromFirestore(
              firebaseUser.uid
            );
          setUser(userData);
        } catch (err) {
          console.error("Fehler beim Abrufen der Backend-Nutzerdaten:", err);
        }
      } else {
        await flushUser();
        setUser(null);
      }
    });

    return () => unsubscribe();
    // Keine Dependencies → nur beim Mount einmal ausgeführt
  }, []);

  return null; // kein UI, nur Sync
};
