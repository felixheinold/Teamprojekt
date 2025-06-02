import React, { createContext, useState, useContext } from "react";

export type UserProfile = {
  username: string;
  email: string;
  avatar: string;
};

const UserContext = createContext<{
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const handleSetUser = (profile: UserProfile | null) => {
    if (profile) {
      localStorage.setItem("user", JSON.stringify(profile));
    } else {
      localStorage.removeItem("user");
    }
    setUser(profile);
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </UserContext.Provider>
  );
};
