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
      console.log("🔁 Auth-State-Changed Trigger");

      if (firebaseUser && firebaseUser.emailVerified) {
        const userData = await generalAPICallsService.getUserDataFromFirestore();
        setUser(userData);
      } else {
        await flushUser();
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []); // ✅ Nur einmalig beim Mount

  return null;
};
