import { useLocalStorage, useWindowSize } from "@uidotdev/usehooks";
import React, { useEffect } from "react";
import { useZStore } from "../../provider";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "../AlertModal";
import { Sheet, SheetContent, SheetHeader } from "../Sheet";
import Login from "../../Pages/Login";
import { Button } from "../Button";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../Tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const query_cleint = new QueryClient();

  const { setIsDarkMode, loginAttempt, setLoginAttempt } = useZStore();
  const [localstorage_data, saveTheme] = useLocalStorage<
    "dark" | "light" | null
  >("theme", null);
  const { width } = useWindowSize();

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
    // Cleanup event listener on component unmount
    return () => {};
  }, []); // Empty dependency array to run the effect only once after the initial render

  const authPopup =
    loginAttempt &&
    (Number(width) > 770 ? (
      <AlertDialog open={loginAttempt.attempt}>
        <AlertDialogContent>
          <Login
            fallback={loginAttempt.fallback}
            title="First things first login!"
            description="Just login need for you to access this action/page"
            isPopup
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setLoginAttempt({ attempt: false })}
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ) : (
      <Sheet open={loginAttempt.attempt}>
        <SheetContent className="py-6" side="bottom">
          <SheetHeader>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setLoginAttempt({ attempt: false })}
                    className=" absolute mt-3 mr-3 top-0 right-0"
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <X />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SheetHeader>
          <Login
            fallback={loginAttempt.fallback}
            title="First things first login!"
            description="Just login need for you to access this action/page"
            isPopup
          />
        </SheetContent>
      </Sheet>
    ));

  return (
    <QueryClientProvider client={query_cleint}>
      {authPopup}
      {children}
    </QueryClientProvider>
  );
};

export default AppProvider;
