import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./UserContext";
import { useEffect, useState } from "react";
import { auth } from "../firebaseData/firebaseConfig";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const { user, setUser } = useUser();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.reload(); // Sicherheitsaktualisierung
        const isVerified = firebaseUser.emailVerified;

        if (isVerified) {
          // Beispiel-Nutzerprofil aus Firebase-Daten erstellen
          const userProfile = {
            userId: firebaseUser.uid,
            userName: firebaseUser.displayName || "No Name",
            userMail: firebaseUser.email || "",
            userProfilePicture: firebaseUser.photoURL || "",
            userGameInfo: {
              highscore: 0,
              lastGameDate: null,
            },
          };

          setUser(userProfile); // UserContext füllen
          setVerified(true);
        } else {
          setVerified(false);
          setUser(null);
        }
      } else {
        setVerified(false);
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  if (loading) return <div>Loading...</div>;

  if (!verified) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
