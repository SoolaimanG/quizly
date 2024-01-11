import { Navigate } from "react-router-dom";
import { app_config, protected_route_props } from "./Types/components.types";
import { useAuthentication } from "./Hooks";

const ProtectedRoute = ({ element }: protected_route_props) => {
  const { isAuthenticated, loading } = useAuthentication();
  if (!isAuthenticated && !loading) {
    return <Navigate to={app_config.login_page} />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
