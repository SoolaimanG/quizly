// import React from 'react'

import { FC } from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { Button } from "../../components/Button";
import { ChevronLeftSquare, ChevronRightSquare } from "lucide-react";
import Hint from "../../components/Hint";
import { useSurveyWorkSpace } from "../../provider";

import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";
import { ToggleDeviceView } from "./ToggleDeviceView";
import { CardContent, Card } from "../../components/Card";

export const MySpace: FC<{ className?: string }> = ({ className }) => {
  const { collapseSideBar, deviceView, setCollapseSideBar } =
    useSurveyWorkSpace();

  const handleCollapse = (props: "sidebarOne" | "sidebarTwo") => {
    if (props === "sidebarOne") {
      setCollapseSideBar({
        ...collapseSideBar,
        sideBarOne: !collapseSideBar.sideBarOne,
      });
    }

    if (props === "sidebarTwo") {
      setCollapseSideBar({
        ...collapseSideBar,
        sideBarTwo: !collapseSideBar.sideBarTwo,
      });
    }
  };

  return (
    <motion.div
      animate={{ width: "100%" }}
      className={cn("h-screen w-full relative", className)}
    >
      <div className="md:max-w-3xl w-full h-full flex items-center justify-center m-auto">
        {deviceView === "desktop" ? <Desktop /> : <Mobile />}
      </div>

      <footer className="absolute hidden md:flex bottom-3 right-0 px-3 w-full items-center justify-between">
        <Hint
          element={
            <Button
              onClick={() => handleCollapse("sidebarOne")}
              size="icon"
              variant="outline"
            >
              <ChevronLeftSquare
                className={cn(
                  collapseSideBar.sideBarOne &&
                    "rotate-180 transition-all ease-linear"
                )}
              />
            </Button>
          }
          content={
            collapseSideBar.sideBarOne ? "Open Sidebar" : "Collapse Sidebar"
          }
        />
        <ToggleDeviceView />
        <Hint
          element={
            <Button
              onClick={() => handleCollapse("sidebarTwo")}
              size="icon"
              variant="outline"
            >
              <ChevronRightSquare
                className={cn(
                  collapseSideBar.sideBarTwo &&
                    "rotate-180 transition-all ease-linear"
                )}
              />
            </Button>
          }
          content={
            collapseSideBar.sideBarTwo ? "Open Sidebar" : "Collapse Sidebar"
          }
        />
      </footer>
    </motion.div>
  );
};
