import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./UserContext";

const ProtectedRoute = () => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

/*({ children }: { children: JSX.Element })*/