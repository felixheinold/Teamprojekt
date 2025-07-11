import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./UserContext";


const ProtectedRoute = () => {
  const { user, firebaseUser } = useUser();

  if (!firebaseUser?.emailVerified) {
    console.log("In der Protected Route:")
    console.log(!firebaseUser);
    console.log(!firebaseUser?.emailVerified);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

/*({ children }: { children: JSX.Element })*/