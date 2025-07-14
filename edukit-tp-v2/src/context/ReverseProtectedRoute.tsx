import { ReactNode, useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { auth } from '../firebaseData/firebaseConfig';

interface Props {
  children: ReactNode;
}

const ReverseProtectedRoute = () => {
  
  const [checking, setChecking] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      user.reload().then(() => {
        if (user.emailVerified) {
          setShouldRedirect(true);
        }
        setChecking(false);
      }).catch(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) return null; // Alternativ: <LoadingSpinner />

  if (shouldRedirect) {
    return <Navigate to="/home" replace />;
  }

  return < Outlet/>;
};

export default ReverseProtectedRoute;
