import { Navigate, Outlet } from "react-router-dom";
import {useEffect, useState} from "react";
import { auth } from "../firebaseData/firebaseConfig";
import { BackendUserSyncHandler } from "./BackendUserSyncHandler";

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

  return <>
  <BackendUserSyncHandler />
    <Outlet />
  </>;
};

export default ProtectedRoute;
