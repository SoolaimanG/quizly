import { Navigate } from "react-router-dom";
import { protected_route_props } from "./Types/components.types";
import React from "react";
import { useMethods } from "./Hooks";

const ProtectedRoute = ({ element }: protected_route_props) => {
  const { isAuthenticated } = useMethods();

  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" />;
  }

  return <React.Fragment>{element}</React.Fragment>;
};

export default ProtectedRoute;
