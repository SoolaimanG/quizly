//import React from 'react'

import { AlertCircle, AlignRight, Plus } from "lucide-react";
import { Button } from "../../components/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/Sheet";
import { app_config } from "../../Types/components.types";
import { useZStore } from "../../provider";
import { useMethods } from "../../Hooks";
import ManageAccount from "../../components/App/ManageAccount";
import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";
import { Lightbulb } from "lucide-react";
import Darkmode from "../../components/Darkmode";
import { Label } from "../../components/Label";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import VerifyEmail from "../../components/App/VerifyEmail";
import Logo from "../../components/Logo";
import Hint from "../../components/Hint";
import { Swords } from "lucide-react";
//import { WordOfTheDay } from "../../components/App/WordOfTheDay";

const navbarLinks = [
  {
    name: "Quizzes",
    path: app_config.quizzes,
    icon: <Lightbulb />,
  },
  {
    name: "Create Quiz",
    path: "",
    icon: <PenLine />,
  },
  {
    name: "Create Survey",
    path: app_config.create_survey,
    icon: <Plus />,
  },
  {
    name: "Challenge Friend",
    path: app_config.challenge_friend,
    icon: <Swords />,
  },
];

const NavBar = () => {
  const { user, setLoginAttempt } = useZStore();
  const { isAuthenticated } = useMethods();
  return (
    <div className="w-full px-2 shadow-md bg-white dark:bg-slate-800 z-30 py-2 fixed">
      <div className="md:max-w-6xl flex items-center justify-between m-auto">
        <h1 className="text-xl text-green-500">Explore</h1>
        {/*<WordOfTheDay word="Soolaiman" />*/}
        <div className="flex items-center gap-2">
          <Sheet>
            {/*<SheetTrigger>*/}
            <Hint
              element={
                <SheetTrigger className="bg-secondary p-2 rounded-md text-secondary-foreground hover:bg-secondary/80">
                  <AlignRight />
                </SheetTrigger>
              }
              content="Open"
            />
            {/*</SheetTrigger>*/}
            <SheetContent side={"left"}>
              <SheetHeader className="flex flex-col">
                <SheetTitle className="text-green-500 text-3xl">
                  Explore Quizly
                </SheetTitle>
                <SheetDescription className="w-full text-left">
                  {`Explore ${app_config.AppName} and create quizzes`}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-5 flex w-full flex-col gap-3">
                {navbarLinks.map((link, i) => (
                  <Button
                    className="w-full flex gap-2 items-center justify-start"
                    size={"lg"}
                    variant={"outline"}
                    key={i}
                  >
                    <span className="text-green-500">{link.icon}</span>
                    <Link
                      className="w-full flex items-center justify-start"
                      to={link.path}
                    >
                      {link.name}
                    </Link>
                  </Button>
                ))}
                <div className="flex items-center gap-1 mt-5">
                  <Darkmode />{" "}
                  <Label>Toggle between darkmode and light mode.</Label>
                </div>
              </div>
              <div className="absolute w-full p-3 flex flex-col gap-1 bottom-0 left-0">
                {!user?.email_verified ? (
                  <div className="flex items-center justify-center flex-col gap-1">
                    <Logo show_word style="italic" color size="default" />
                    <p>All Right Reserved.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Verify Email</AlertTitle>
                      <AlertDescription>
                        Click the verify email button to send verification link
                      </AlertDescription>
                    </Alert>
                    <VerifyEmail
                      varient="destructive"
                      user_email={user?.email as string}
                    />
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          {isAuthenticated() ? (
            <ManageAccount
              username={user?.username as string}
              account_type={user?.account_type as "S"}
              profile_image={user?.profile_image as string}
            />
          ) : (
            <Button
              onClick={() =>
                setLoginAttempt({
                  attempt: true,
                  fallback: app_config.explore_page,
                })
              }
              className="bg-green-400"
              variant={"base"}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
