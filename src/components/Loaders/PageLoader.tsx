import { Loader2 } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";

const PageLoader: React.FC<{
  text?: string;
  size: number;
  className?: string;
}> = ({ text = "Loading...", size = 90, className }) => {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-1 items-center justify-center",
        className
      )}
    >
      <Loader2 size={size} className="text-green-500 animate-spin" />
      <p className="text-center text-green-500 text-lg animate-pulse">{text}</p>
    </div>
  );
};

export default PageLoader;
