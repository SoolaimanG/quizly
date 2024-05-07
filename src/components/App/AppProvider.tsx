import { useLocalStorage } from "@uidotdev/usehooks";
import React, { useEffect } from "react";
import { useComingSoonProps, useZStore } from "../../provider";
import { useAuthentication } from "../../Hooks";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../Functions/APIqueries";
import { IUser } from "../../Types/components.types";
import { ComingSoon } from "./ComingSoon";
import { CompleteSignUp } from "./CompleteSignUp";
import { EmailVerificationModal } from "./EmailVerificationModal";
import { TutorOnboarding } from "./TutorOnboarding";
import { LoginModal } from "./LoginModal";
import { ConnectAnonymousUserQuizResultToAuthUser } from "../../Pages/Quiz/ConnectAnonymousUserQuizResultToAuthUser";

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setIsDarkMode } = useZStore();
  const {
    isVisible,
    description,
    joinWaitList,
    featureName,
    setIsVisible,
    setType,
    type,
  } = useComingSoonProps();
  const [localstorage_data, saveTheme] = useLocalStorage<
    "dark" | "light" | null
  >("theme", null);
  const { isAuthenticated } = useAuthentication();
  const { setUser } = useZStore();
  const { data, error } = useQuery<{ data: IUser }>({
    queryKey: ["current_user", isAuthenticated],
    queryFn: () => getUser(),
    enabled: isAuthenticated,
  });

  // This toggle dark modes and light mode.
  useEffect(() => {
    if (
      window.matchMedia("(prefers-color-scheme: dark)").matches ||
      localstorage_data === "dark"
    ) {
      saveTheme("dark");
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      saveTheme("light");
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }

    isAuthenticated && !error && data?.data && setUser(data?.data);
  }, [data?.data, isAuthenticated]); // Empty dependency array to run the effect only once after the initial render

  return (
    <React.Fragment>
      {/* A Modal For User to login */}
      <LoginModal />

      {/* A modal to tell users to verify their email address */}
      <EmailVerificationModal />
      {/* A Modal for users to complete their sign-up process */}
      <CompleteSignUp />
      {/* Modal to complete signup for tutor account */}
      <TutorOnboarding />

      {/* The Semi Modal connect the quiz authenticated user has participated in and save it when the user is logged in */}
      <ConnectAnonymousUserQuizResultToAuthUser />

      {/* A modal for coming soon features */}
      {isVisible && (
        <ComingSoon
          props={{
            description,
            joinWaitList,
            featureName,
            isVisible,
            setIsVisible,
            type,
            setType,
          }}
        />
      )}

      {children}
    </React.Fragment>
  );
};

export default AppProvider;
