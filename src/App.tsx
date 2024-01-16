import AuthLayout from "./Pages/Comps/AuthLayout";
import LandingPage from "./Pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import AppProvider from "./components/App/AppProvider";
import { Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Onboarding from "./Pages/Onboarding";
import { app_config } from "./Types/components.types";
import Explore from "./Pages/ExplorePage/Explore";
import Quiz from "./Pages/Quiz/Quiz";
import useKeyboardShortcut from "use-keyboard-shortcut";
import { toggle_modes } from "./Functions";
import { useZStore } from "./provider";
import { useLocalStorage } from "@uidotdev/usehooks";

function App() {
  const client = new QueryClient();

  const { setIsDarkMode } = useZStore();
  const [theme, saveTheme] = useLocalStorage<"dark" | "light" | null>(
    "theme",
    null
  );

  useKeyboardShortcut(
    ["Control", "M"],
    () => toggle_modes({ theme, saveTheme, setIsDarkMode }),
    {
      overrideSystem: true,
      repeatOnHold: false,
    }
  );

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
          <Route path={app_config.quiz + ":id"} element={<Quiz />} />
        </Routes>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
