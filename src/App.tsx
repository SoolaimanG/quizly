import AuthLayout from "./Pages/Comps/AuthLayout";
import LandingPage from "./Pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import AppProvider from "./components/App/AppProvider";
import { Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Onboarding from "./Pages/Onboarding";
import { app_config } from "./Types/components.types";
import Explore from "./Pages/ExplorePage/Explore";

function App() {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <AppProvider>
        <Routes>
          <Route path={app_config.landing_page} element={<LandingPage />} />
          <Route
            path={app_config.login_page}
            element={<AuthLayout path="Login" />}
          />
          <Route
            path={app_config.confrimEmail + ":token"}
            element={<AuthLayout path="ConfirmEmail" />}
          />
          <Route
            path={app_config.forgetPassword}
            element={<AuthLayout path="ForgetPassword" />}
          />
          <Route
            element={<ProtectedRoute element={<>Home</>} />}
            path="/home"
          />
          <Route
            element={<ProtectedRoute element={<Onboarding />} />}
            path={app_config.onboarding_page}
          />
          <Route path={app_config.explore_page} element={<Explore />} />
        </Routes>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
