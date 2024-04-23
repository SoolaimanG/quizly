import AuthLayout from "./Pages/Comps/AuthLayout";
import LandingPage from "./Pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import AppProvider from "./components/App/AppProvider";
import { Route, Routes } from "react-router-dom";
// import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Onboarding from "./Pages/Onboarding";
import { app_config } from "./Types/components.types";
import Explore from "./Pages/ExplorePage/Explore";
import Quiz from "./Pages/Quiz/Quiz";
import useKeyboardShortcut from "use-keyboard-shortcut";
import { toggle_modes } from "./Functions";
import { useZStore } from "./provider";
import { useLocalStorage } from "@uidotdev/usehooks";
import CommunityLayout from "./Pages/Community/CommunityPages/CommunityLayout";
import Quizzes from "./Pages/Quizzes/Quizzes";
import Create from "./Pages/CreateSurvey/Create";
import WorkSpace from "./Pages/CreateSurvey/WorkSpace";
import ConnectingApps from "./Pages/IntegratedApps/connectingApps";
import PreviewSurvey from "./Pages/CreateSurvey/PreviewSurvey";

function App() {
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
    <AppProvider>
      <Routes>
        <Route path={app_config.landing_page} element={<LandingPage />} />

        {/*-------------- COMMMUNITIES */}
        <Route
          path={app_config.community + ":id"}
          element={<CommunityLayout path="Home" />}
        />
        <Route
          path={app_config.community + "post/" + ":id"}
          element={<CommunityLayout path="Post" />}
        />
        <Route
          path={app_config.community + "edit-post/" + ":id"}
          element={<CommunityLayout path="Edit" />}
        />
        <Route
          path={app_config.community + "members/" + ":id"}
          element={<CommunityLayout path="Members" />}
        />
        <Route
          path={app_config.community + "requests/" + ":id"}
          element={<CommunityLayout path="Requests" />}
        />
        <Route
          path={app_config.community + "settings/" + ":id"}
          element={<CommunityLayout path="Settings" />}
        />
        <Route path={app_config.quizzes} element={<Quizzes />} />

        {/*------------ AUTHENTICATIONS */}
        <Route
          path={app_config.confrimEmail + ":token"}
          element={<AuthLayout path="ConfirmEmail" />}
        />
        <Route
          path={app_config.login_page}
          element={<AuthLayout path="Login" />}
        />
        <Route
          path={app_config.forgetPassword}
          element={<AuthLayout path="ForgetPassword" />}
        />
        <Route element={<ProtectedRoute element={<>Home</>} />} path="/home" />
        <Route
          element={<ProtectedRoute element={<Onboarding />} />}
          path={app_config.onboarding_page}
        />

        {/*-------------- QUIZZES */}
        <Route path={app_config.explore_page} element={<Explore />} />
        <Route path={app_config.quiz + ":id"} element={<Quiz />} />

        {/*-------------- CREATE SURVEYS */}
        <Route
          element={<ProtectedRoute element={<Create />} />}
          path={app_config.create_survey}
        />
        <Route
          element={<ProtectedRoute element={<WorkSpace />} />}
          path={app_config.survey_workspace}
        />
        <Route
          element={<ProtectedRoute element={<WorkSpace />} />}
          path={app_config.survey_workspace}
        />
        <Route
          element={<ProtectedRoute element={<ConnectingApps />} />}
          path={app_config.connect_apps}
        />
        <Route
          element={
            <ProtectedRoute element={<PreviewSurvey mode="PREVIEW" />} />
          }
          path={app_config.preview_survey + ":id"}
        />
        <Route
          element={<PreviewSurvey mode="PRODUCTION" />}
          path={app_config.survey + ":id"}
        />
      </Routes>
    </AppProvider>
  );
}

export default App;
