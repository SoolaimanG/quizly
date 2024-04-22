import { FC, useEffect, useState } from "react";
import { Button } from "./Button";
import { cn } from "../lib/utils";
import { toast } from "./use-toaster";

export const Copy: FC<{
  className?: string;
  text: string;
  description?: string;
  variant: "base" | "secondary" | "ghost";
}> = ({
  className,
  text,
  variant = "base",
  description = "Link copied successfully",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      toast({
        title: "Success",
        description,
      });
    });
  };

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timer = setTimeout(() => {
      setIsCopied(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isCopied]);

  return (
    <Button
      variant={variant}
      onClick={handleCopy}
      className={cn(className, "w-ful")}
    >
      {isCopied ? "Link Copied" : "Copy Link"}
    </Button>
  );
};
