import React from "react";
import { Button } from "../Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../Tooltip";
import { app_config } from "../../Types/components.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { onboardingViewTypes } from "../../Pages/Onboarding";
import { useNavigate } from "react-router-dom";

export const OnboardingNav: React.FC<{
  func: () => void;
  tooltip: string;
  prevNav?: onboardingViewTypes;
}> = ({ func, tooltip, prevNav }) => {
  const navigate = useNavigate();
  const navigationFunction: Record<onboardingViewTypes, any> = {
    "CHANGE-NAME": () => navigate(app_config.change_name),
    "CHANGE-EMAIL": () => navigate(app_config.change_email),
    "ACCOUNT-TYPE": () => navigate(app_config.change_account_type),
    "SELECT-CATEGORIES": () => navigate(app_config.explore_page),
  };

  const handleSkip = (action: "skip" | "prev") => {
    if (!prevNav) {
      return;
    }

    const keys = Object.keys(navigationFunction) as onboardingViewTypes[];
    const currentKeyIndex =
      action === "skip" ? keys.indexOf(prevNav) + 1 : keys.indexOf(prevNav) - 1;
    navigationFunction[action === "prev" ? prevNav : keys[currentKeyIndex]];
  };

  return (
    <div className="flex items-end justify-between">
      <Button onClick={() => handleSkip("skip")} variant={"link"}>
        Skip
      </Button>
      <div className="flex items-center gap-3">
        {prevNav && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => handleSkip("prev")}
                  className="bg-green-400 text-white hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-600"
                  size={"icon"}
                >
                  <ChevronLeft />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to prev</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={func}
                className="bg-green-400 text-white hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-600"
                size={"icon"}
              >
                <ChevronRight />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
