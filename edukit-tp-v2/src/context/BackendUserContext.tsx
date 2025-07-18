import { useState, useEffect, createContext, useContext } from "react";
import { GeneralAPICallsService } from "../firebaseData/generalAPICallsService";
import { UserProfile } from "./UserProfileModel";

type BackendUserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  flushUser: (dataOverride?: UserProfile) => Promise<void>;
  untrackedChanges: () => void;
  hasUntrackedChanges: boolean;
};

const BackendUserContext = createContext<BackendUserContextType | undefined>(
  undefined
);

export const useBackendUserContext = (): BackendUserContextType => {
  const context = useContext(BackendUserContext);
  if (!context) {
    throw new Error(
      "useBackendUserContext has to be with a BackendUserProvider. Error in BackendUserContext.tsx"
    );
  }
  return context;
};

export const BackendUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hasUntrackedChanges, setHasUntrackedChanges] = useState(false);
  const generalAPICallsService = new GeneralAPICallsService();

  const untrackedChanges = () => setHasUntrackedChanges(true);

  const flushUser = async (dataOverride?: UserProfile) => {
    const dataToSave = dataOverride ?? user;

    if (!dataToSave || !hasUntrackedChanges) return;

    // 🔒 Sanity Check vor dem Flush
    const quiz = dataToSave.user_game_information?.quiz;
    if (
      quiz &&
      (isNaN(quiz.accuracy) ||
        !isFinite(quiz.accuracy) ||
        quiz.accuracy === null)
    ) {
      console.warn("❌ Ungültiger accuracy-Wert. Flush abgebrochen.");
      return;
    }

    try {
      await generalAPICallsService.updateUserDataInFirestore(dataToSave);
      setHasUntrackedChanges(false);
      console.log("✅ flushUser erfolgreich");
      console.log("📦 JSON.stringify(user):", JSON.stringify(user, null, 2));
    } catch (err) {
      console.error("❌ Fehler beim Speichern in Firestore (flushUser).", err);
    }
  };

  useEffect(() => {
    const handleUnload = (e: BeforeUnloadEvent) => {
      const innerFlush = async () => {
        if (hasUntrackedChanges) {
          await flushUser();
        }
      };
      innerFlush();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [user, hasUntrackedChanges]);

  useEffect(() => {
    const handleVisChange = () => {
      if (document.visibilityState === "hidden") {
        flushUser();
      }
    };
    document.addEventListener("visibilitychange", handleVisChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisChange);
  }, [flushUser]);

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
