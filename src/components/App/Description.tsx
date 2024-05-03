import { FC } from "react";
import { cn } from "../../lib/utils";

export const Description: FC<{
  text?: string;
  className?: string;
}> = ({ text, className }) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {text || ""}
    </p>
  );
};
