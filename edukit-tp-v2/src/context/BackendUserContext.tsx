import { useState, useEffect, createContext, useContext } from "react";
import { GeneralAPICallsService } from "../firebaseData/generalAPICallsService";
import { UserProfile } from "./UserProfileModel";

type BackendUserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  flushUser: () => Promise<void>;
  untrackedChanges: () => void;
  hasUntrackedChanges: boolean;
};

const BackendUserContext = createContext<BackendUserContextType | undefined>(undefined);

export const useBackendUserContext = (): BackendUserContextType => {
  const context = useContext(BackendUserContext);
  if (!context) {
    throw new Error("useBackendUserContext must be used within BackendUserProvider.");
  }
  return context;
};

export const BackendUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hasUntrackedChanges, setHasUntrackedChanges] = useState(false);
  const generalAPICallsService = new GeneralAPICallsService();

  const untrackedChanges = () => setHasUntrackedChanges(true);

  // Sperrvariable für flush
  let isFlushing = false;

  const flushUser = async () => {
    if (user && hasUntrackedChanges && !isFlushing) {
      isFlushing = true;
      try {
        await generalAPICallsService.updateUserDataInFirestore(user);
        setHasUntrackedChanges(false);
        console.log("✅ Änderungen gespeichert (flushUser)");
      } catch (err) {
        console.error("❌ Fehler beim Speichern des Nutzers (flushUser):", err);
      } finally {
        isFlushing = false;
      }
    }
  };

  // 🚀 Nutzer beim Start laden
  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      try {
        const userData = await generalAPICallsService.getUserDataFromFirestore();
        if (isMounted) {
          setUser(userData);
          console.log("✅ Nutzer geladen (useEffect)");
        }
      } catch (err) {
        console.error("❌ Fehler beim Laden des Nutzers:", err);
      }
    };

    loadUser();
    return () => {
      isMounted = false;
    };
  }, []);

  // 🧹 Änderungen speichern bei Seite verlassen
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUntrackedChanges) {
        flushUser();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUntrackedChanges, user]);

  // 🧹 Änderungen speichern bei Tab-Wechsel
  useEffect(() => {
    const handleVisChange = () => {
      if (document.visibilityState === "hidden") {
        flushUser();
      }
    };
    document.addEventListener("visibilitychange", handleVisChange);
    return () => document.removeEventListener("visibilitychange", handleVisChange);
  }, [hasUntrackedChanges, user]);

  return (
    <BackendUserContext.Provider
      value={{
        user,
        setUser,
        flushUser,
        untrackedChanges,
        hasUntrackedChanges,
      }}
    >
      {children}
    </BackendUserContext.Provider>
  );
};
