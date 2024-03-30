import { Navigate, useLocation } from "react-router-dom";
import { app_config, protected_route_props } from "./Types/components.types";
import { useAuthentication } from "./Hooks";
import PageLoader from "./components/Loaders/PageLoader";

const ProtectedRoute = ({ element }: protected_route_props) => {
  const { isAuthenticated, loading, error } = useAuthentication();
  const fallbackURL = window.location;
  const location = useLocation();
  const path = fallbackURL.pathname + location.search;

  if (loading) return <PageLoader className="h-screen" size={60} />;

  if (error && !isAuthenticated) {
    return <Navigate to={app_config.login_page + `?fallbackUrl=${path}`} />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
