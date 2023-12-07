import AuthLayout from "./Pages/Comps/AuthLayout";
import LandingPage from "./Pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import AppProvider from "./components/App/AppProvider";
import { Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Onboarding from "./Pages/Comps/Onboarding";

function App() {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<AuthLayout path="Login" />} />
          <Route path="/auth/signup" element={<AuthLayout path="SignUp" />} />
          <Route
            path="/auth/confirm-email/:token"
            element={<AuthLayout path="ConfirmEmail" />}
          />
          <Route
            path="/auth/forget-password"
            element={<AuthLayout path="ForgetPassword" />}
          />
          <Route
            element={<ProtectedRoute element={<>Home</>} />}
            path="/home"
          />
          <Route element={<Onboarding />} path="/quizly-onboarding/:view" />
        </Routes>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
