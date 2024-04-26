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
import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { DarkMode } from "../../components/Darkmode";
import { Label } from "../../components/Label";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import { VerifyEmail } from "../../components/App/VerifyEmail";
import Logo from "../../components/Logo";
import Hint from "../../components/Hint";
import { Swords } from "lucide-react";
import { Input } from "../../components/Input";
import { UserAvatar } from "../../components/App/userAvatar";
import { useState } from "react";

const _navbarLinks = [
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

const NavBar = ({
  show_search_bar = true,
  navbarText,
  isAuthenticated,
  onSubmit,
}: {
  show_search_bar?: boolean;
  navbarText: string;
  isAuthenticated: boolean;
  onSubmit: (search: string) => void;
}) => {
  const { user } = useZStore();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <div className="w-full px-2 shadow-md bg-white dark:bg-slate-800 z-30 py-2 fixed">
      <div className="md:max-w-6xl w-full flex items-center justify-between m-auto">
        <h1 className="text-xl text-green-500">{navbarText}</h1>
        {show_search_bar && (
          <form
            onSubmit={handleSubmit}
            className="w-full flex items-center justify-center"
            action=""
          >
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-3/4"
              placeholder="Find Quiz, Teachers and Surveys"
            />
          </form>
        )}
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
                {_navbarLinks.map((link, i) => (
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
                  <DarkMode />{" "}
                  <Label>Toggle between darkmode and light mode.</Label>
                </div>
              </div>
              <div className="absolute w-full p-3 flex flex-col gap-1 bottom-0 left-0">
                {user?.email_verified ? (
                  <div className="flex items-center justify-center flex-col gap-1">
                    <Logo show_word style="italic" color size="default" />
                    <p>All Right Reserved.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <Alert className="dark:text-red-500" variant="destructive">
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
          <UserAvatar isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
