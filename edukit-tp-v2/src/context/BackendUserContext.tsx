import { useState, useEffect, createContext, useContext } from "react";
import { useUser } from "./UserContext";
import { GeneralAPICallsService } from "../firebaseData/generalAPICallsService";
import { UserProfile } from "./UserProfileModel";

type BackendUserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  flushUser: () => Promise<void>;
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

  const flushUser = async () => {
    if (user && hasUntrackedChanges) {
      try {
        await generalAPICallsService.updateUserDataInFirestore(user);
        setHasUntrackedChanges(false);
      } catch (err) {
        console.error(
          "Error while saving user in Firestore. Error message from BackendUserContext.tsx"
        );
      }
    }
  };

  useEffect(() => {
    const handleUnload = (e: BeforeUnloadEvent) => {
      const innerFlush = async () => {
        if (hasUntrackedChanges) {
          await flushUser();
          //navigator.sendBeacon("/api/user/save", JSON.stringify(user)); // oder flushUser()
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
