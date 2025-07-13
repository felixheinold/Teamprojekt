import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./UserContext";
import {useEffect, useState} from "react";
import { auth } from "../firebaseData/firebaseConfig";

const ProtectedRoute = () => {
  const [verified, setVerified] = useState<boolean| null> (null);

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user){
      await user.reload();
      setVerified(user.emailVerified)
    }else{
      setVerified(false);
    }
    });
    return () => unsubscribe();
  }, []);

  if (verified === null) {
    return <div>Loading...</div>
  }else if(!verified){
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

/*({ children }: { children: JSX.Element })*/