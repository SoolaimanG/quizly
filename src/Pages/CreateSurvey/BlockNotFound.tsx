import { FC } from "react";
import { Description } from "../ExplorePage/QuickQuiz";
import { cn } from "../../lib/utils";

export const BlockNotFound: FC<{
  title?: string;
  message?: string;
  className?: string;
}> = ({
  title = "Block Not Found.",
  className,
  message = "You seems to be lost. This block has either been deleted or has not been created.",
}) => {
  return (
    <div className={cn("", className)}>
      <h1 className="text-3xl">{title}</h1>
      <Description text={message + " Press Ctrl + / to open blocks."} />
    </div>
  );
};
