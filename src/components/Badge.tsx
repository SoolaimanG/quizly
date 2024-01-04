import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground text-slate-300 dark:text-white border-foreground",
        success: "bg-green-700 text-white",
        warning: "bg-yellow-700 text-white",
        friendly: "bg-blue-300 text-white",
      },
      styles: {
        all_round: "rounded-full",
        left_round: "rounded-l-full",
        right_round: "rounded-r-full",
      },
    },
    defaultVariants: {
      variant: "default",
      styles: "all_round",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, styles, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, styles }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
