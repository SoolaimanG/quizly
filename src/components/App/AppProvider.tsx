import { useLocalStorage, useWindowSize } from "@uidotdev/usehooks";
import React, { useEffect } from "react";
import { useComingSoonProps, useZStore } from "../../provider";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../AlertModal";
import Login from "../../Pages/Login";
import { Button } from "../Button";
import { X } from "lucide-react";
import Hint from "../Hint";
import { useAuthentication } from "../../Hooks";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../Functions/APIqueries";
import { IUser } from "../../Types/components.types";
import { ComingSoon } from "./ComingSoon";
import { CompleteSignUp } from "./CompleteSignUp";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../Drawer";
import { EmailVerificationModal } from "./EmailVerificationModal";
import { TutorOnboarding } from "./TutorOnboarding";

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    setIsDarkMode,
    loginAttempt,
    setLoginAttempt,
    emailVerificationRequired,
    setEmailVerificationRequired,
  } = useZStore();
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
  const { width } = useWindowSize();
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

  //This is the popup to appear if the a user tries to login without authentication
  const authPopup =
    Number(width) > 770 ? (
      <AlertDialog
        onOpenChange={() => setLoginAttempt({ attempt: !loginAttempt.attempt })}
        open={loginAttempt.attempt}
      >
        <AlertDialogContent>
          <Login
            fallback={loginAttempt.fallback}
            title="First things first login!"
            description="Just login need for you to access this action/page"
            isPopup
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ) : (
      <Drawer
        direction="bottom"
        shouldScaleBackground
        onOpenChange={() => setLoginAttempt({ attempt: !loginAttempt.attempt })}
        open={loginAttempt.attempt}
      >
        <DrawerContent className="py-6">
          <DrawerHeader>
            <DrawerClose>
              <Hint
                element={
                  <Button
                    className=" absolute mt-3 mr-3 top-0 right-0"
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <X />
                  </Button>
                }
                content="Close"
              />
            </DrawerClose>
          </DrawerHeader>
          <Login
            fallback={loginAttempt.fallback}
            title="First things first login!"
            description={
              loginAttempt.note ||
              "Just login need for you to access this action/page"
            }
            isPopup
          />
        </DrawerContent>
      </Drawer>
    );

  return (
    <React.Fragment>
      {authPopup}

      {/* A modal to tell users to verify their email address */}
      <EmailVerificationModal />
      {/* A Modal for users to complete their sign-up process */}
      <CompleteSignUp />
      {/* Modal to complete signup for tutor account */}
      <TutorOnboarding />

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
