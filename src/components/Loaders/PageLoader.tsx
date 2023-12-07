import { Loader2 } from "lucide-react";
import React from "react";

const PageLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  return (
    <div className="w-full flex flex-col gap-1 items-center justify-center">
      <Loader2 size={90} className="text-green-500 animate-spin" />
      <p className="text-center text-green-500 text-lg animate-pulse">{text}</p>
    </div>
  );
};

export default PageLoader;
