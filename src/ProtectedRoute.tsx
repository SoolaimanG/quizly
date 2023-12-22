import { Navigate } from "react-router-dom";
import { app_config, protected_route_props } from "./Types/components.types";

const ProtectedRoute = ({ element }: protected_route_props) => {
  if (false) {
    return <Navigate to={app_config.login_page} />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
