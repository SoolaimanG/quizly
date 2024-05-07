import { FC, ReactElement } from "react";
import { cn } from "../../lib/utils";

export const ConnectQuizAsAuthUser: FC<{
  children: ReactElement;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn("w-full", className)}>{children}</div>;
};
