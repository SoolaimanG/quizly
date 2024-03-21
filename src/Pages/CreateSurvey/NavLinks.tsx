// import React from 'react'

import { NavLink } from "react-router-dom";
import { app_config } from "../../Types/components.types";
import { cn } from "../../lib/utils";
import { FC } from "react";

const _navlinks = [
  {
    name: "Create",
    path: app_config.survey_workspace,
  },
  {
    name: "Connect",
    path: app_config.connect_survey,
  },
  {
    name: "Share",
    path: app_config.share_survey,
  },
  {
    name: "Result",
    path: app_config.survey_result,
  },
];

export const NavLinks: FC<{ className?: string; itemClassName?: string }> = ({
  className,
  itemClassName,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {_navlinks.map((link) => (
        <NavLink
          className={({ isActive }) =>
            cn(
              isActive
                ? "text-green-500  text-lg"
                : "text-muted-foreground text-lg",
              itemClassName
            )
          }
          key={link.name}
          to={link.path}
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  );
};
