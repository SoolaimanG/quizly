// import React from 'react'

import { FC, ReactElement } from "react";
import { cn } from "../../lib/utils";

type navbarType = {
  title: string;
  className?: string;
  middleContent: ReactElement;
  lastContent: ReactElement;
};

export const Navbar: FC<navbarType> = ({
  title,
  className,
  middleContent,
  lastContent,
}) => {
  return (
    <nav
      className={cn(
        "w-full z-30 p-3 fixed flex items-center justify-between top-0 left-0 dark:bg-slate-950 bg-white",
        className
      )}
    >
      <h1 className="text-green-500 text-lg">{title}</h1>
      {middleContent}
      {lastContent}
    </nav>
  );
};
