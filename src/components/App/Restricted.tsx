//import React from 'react'
import { ShieldOff } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../Button";

export const Restricted: React.FC<{
  message?: string;
  className?: string;
  icon_size?: number;
  action?: {
    function?: () => void;
    button_text?: string;
  };
}> = ({
  message = "You are blocked from this page",
  className,
  icon_size = 70,
  action,
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-2 items-center justify-center",
        className
      )}
    >
      <ShieldOff size={icon_size} className="text-red-500" />
      <p className="">{message}</p>

      {action && (
        <Button
          className="w-full"
          variant={"destructive"}
          onClick={action.function}
        >
          {action.button_text}
        </Button>
      )}
    </div>
  );
};
