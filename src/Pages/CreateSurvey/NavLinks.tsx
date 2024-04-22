// import React from 'react'

import { NavLink, useLocation } from "react-router-dom";
import { app_config } from "../../Types/components.types";
import { cn } from "../../lib/utils";
import { FC } from "react";
import queryString from "query-string";

export const NavLinks: FC<{ className?: string; itemClassName?: string }> = ({
  className,
  itemClassName,
}) => {
  const location = useLocation();
  const qs = queryString.parse(location.search, { parseBooleans: true }) as {
    id: string;
    block?: string;
    opend?: boolean;
    connect?: boolean;
    share?: boolean;
  };

  const _navlinks = [
    {
      name: "Create",
      path: app_config.survey_workspace,
    },
    {
      name: "Connect",
      path:
        app_config.survey_workspace +
        `?id=${qs.id}${qs.block ? `&block=${qs?.block}` : ""}&connect=true`,
    },
    {
      name: "Share",
      path:
        app_config.survey_workspace +
        `?id=${qs.id}${qs.block ? `&block=${qs?.block}` : ""}&share=true`,
    },
    {
      name: "Result",
      path: app_config.survey_result,
    },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {_navlinks.map((link) => (
        <NavLink
          className={({ isActive }) =>
            cn(
              isActive &&
                (link.name.toLowerCase() === "create" ||
                  link.name.toLowerCase() === "result")
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
