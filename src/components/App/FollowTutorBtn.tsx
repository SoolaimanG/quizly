import { FC, ReactNode } from "react";
import { cn } from "../../lib/utils";

export const FollowTutorBtn: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn(className)}>{children}</div>;
};
