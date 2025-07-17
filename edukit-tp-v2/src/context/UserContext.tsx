// src/context/UserContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { UserProfile } from "./UserProfileModel";


type UserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  //firebaseUser: User | null;
  //setFirebaseUser: (user:User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Beim Mount initial aus localStorage lesen
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Fehler beim Parsen von user aus localStorage:", err);
    }
  }, []);

  // Sync über mehrere Tabs
  useEffect(() => {
    const syncUserAcrossTabs = (event: StorageEvent) => {
      if (event.key === "user") {
        try {
          const newValue = event.newValue;
          if (newValue) {
            setUser(JSON.parse(newValue));
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", syncUserAcrossTabs);
    return () => window.removeEventListener("storage", syncUserAcrossTabs);
  }, []);

  // Wenn user gesetzt wird, automatisch speichern oder löschen
  const handleSetUser = (profile: UserProfile | null) => {
    if (profile) {
      localStorage.setItem("user", JSON.stringify(profile));
      setUser(profile);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // Optional: sync mit localStorage, falls mehrere Tabs/Fenster
  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser,/* firebaseUser, setFirebaseUser */}}>
      {children}
    </UserContext.Provider>
  );
};
