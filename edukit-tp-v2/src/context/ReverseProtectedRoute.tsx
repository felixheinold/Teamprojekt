import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { auth } from '../firebaseData/firebaseConfig';


/***
 * 
 * ATTENTION: Component isn't used atm
 * DON'T USE IT
 * 
 */
const ReverseProtectedRoute = () => {
  const [checking, setChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setShouldRedirect(true);
        }
      }
      setChecking(false);
    });

    return () => unsubscribe();
    }, 200);  
    return () => clearTimeout(timer);  
  }, []);
 

  if (checking) return null; // oder <LoadingSpinner />

  if (shouldRedirect) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ReverseProtectedRoute;
