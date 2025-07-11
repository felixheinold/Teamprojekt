// src/context/UserContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import {User, onAuthStateChanged} from "firebase/auth";
import { auth } from "../firebaseData/firebaseConfig";

export type UserProfile = {
  userId: string;
  userName: string;
  userMail: string;
  userProfilePicture: string;
  userGameInfo: {
    highscore: number;
    lastGameDate: string | null;
  };
};

type UserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  firebaseUser: User | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleSetUser = (profile: UserProfile | null) => {
    if (profile) {
      localStorage.setItem("user", JSON.stringify(profile));
    } else {
      localStorage.removeItem("user");
    }
    setUser(profile);
  };

  const [firebaseUser, setFirebaseUser] = useState<User | null>(auth.currentUser);
  // Optional: sync mit localStorage, falls mehrere Tabs/Fenster
  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      await user.reload(); // frische Daten (z. B. emailVerified)
      setFirebaseUser(user);
    } else {
      setFirebaseUser(null);
    }
  });

  return () => unsubscribe();
}, []);


  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser, firebaseUser }}>
      {children}
    </UserContext.Provider>
  );
};
