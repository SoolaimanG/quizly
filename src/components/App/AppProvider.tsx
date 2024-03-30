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
import VerifyEmail from "./VerifyEmail";
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

const content = Object.freeze({
  description:
    "we have to make sure your email is valid and verify please giving you access to this action.",
  header: "Email Verification Is Required",
});

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useZStore();

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
    queryKey: ["current_user"],
    queryFn: () => getUser(),
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

  const verify_email_pop =
    Number(width) > 770 ? (
      <AlertDialog
        onOpenChange={() =>
          setEmailVerificationRequired(!emailVerificationRequired)
        }
        open={emailVerificationRequired}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{content.header}</AlertDialogTitle>
            <AlertDialogDescription>
              {content.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <VerifyEmail show_input user_email={user?.email as string} />
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ) : (
      <Drawer>
        <DrawerContent className="py-6">
          <DrawerHeader className="flex flex-col gap-2">
            <DrawerTitle>{content.header}</DrawerTitle>
            <DrawerDescription>{content.description}</DrawerDescription>
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
          <VerifyEmail show_input user_email={user?.email as string} />
        </DrawerContent>
      </Drawer>
    );

  return (
    <React.Fragment>
      {authPopup}

      {/* A modal to tell users to verify their email address */}
      {verify_email_pop}

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

      {/* A Modal for users to complete their sign-up process */}
      <CompleteSignUp />

      {children}
    </React.Fragment>
  );
};

export default AppProvider;
