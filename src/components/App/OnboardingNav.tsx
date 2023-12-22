import React from "react";
import { Button } from "../Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../Tooltip";
import { useLocalStorage } from "@uidotdev/usehooks";
import { onboardingProps } from "../../Types/components.types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OnboardingNav: React.FC<{
  func: () => void;
  tooltip: string;
  havePrev: boolean;
  prevNav: onboardingProps;
}> = ({ func, tooltip, havePrev = false, prevNav }) => {
  const [__, setViews] = useLocalStorage<onboardingProps>(
    "view",
    "DefaultView"
  );
  return (
    <div className="flex items-end justify-between">
      <Button variant={"link"}>Skip</Button>
      <div className="flex items-center gap-3">
        {havePrev && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => setViews(prevNav)}
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

export default OnboardingNav;
